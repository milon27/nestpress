import { fromNodeHeaders } from "better-auth/node"
import { NextFunction, Request, Response } from "express"
import { ForbiddenError, UnAuthorizedError } from "../common/model/error.model"
import { auth } from "../config/auth/auth"
import { IUser } from "../config/db/schema"

const isLoggedInMid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // token validation
        const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
        if (!session) {
            throw new UnAuthorizedError()
        }
        req.user = session.user as IUser
        req.token = session.session.token

        next()
    } catch (e) {
        // res.status(StatusCode.UNAUTHORIZED).json(MyErrorResponse(ErrorCode.UNAUTHORIZED, (e as Error).message))
        next(e)
    }
}

const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role === "admin") {
            next()
        } else {
            throw new ForbiddenError("You don't have permission")
        }
    } catch (e) {
        next(e)
    }
}

export const AuthMid = {
    isLoggedInMid,
    isSuperAdmin: [isLoggedInMid, isSuperAdmin],
}
