import { NextFunction, Request, Response } from "express"
import { ForbiddenError } from "../common/model/error.model"
import { KeyConstant } from "../config/constant/key.constant"
import { AccessTokenUtil } from "../utils/access-token.util"

const isLoggedInMid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // todo: const authHead = req.agent === "android" ? req.headers.authorization : undefined
        const authHead = req.headers.authorization
        const token: string | undefined =
            req.cookies[KeyConstant.ACCESS_TOKEN_COOKIE_KEY] || (authHead && authHead.split(" ")[1])

        // token validation
        const user = await AccessTokenUtil.verifyToken(token)
        req.accessToken = token
        req.user = user

        next()
    } catch (e) {
        // res.status(StatusCode.UNAUTHORIZED).json(MyErrorResponse(ErrorCode.UNAUTHORIZED, (e as Error).message))
        next(e)
    }
}

const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.isSuperAdmin === true) {
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
