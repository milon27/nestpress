import { NextFunction, Request, Response } from "express"
import { UnAuthorizedError } from "../../../common/model/error.model"
import { StatusCode } from "../../../config/constant/code.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { AccessTokenUtil } from "../../../utils/access-token.util"
import { CookieUtil } from "../../../utils/cookie.util"
import { MyResponse } from "../../../utils/my-response.util"

import { UserService } from "../../user/user.service"
import { ILogoutDto } from "./dto/logout.dto"

export const LogoutController = {
    logoutUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.accessToken
            const { isWeb } = req.body as ILogoutDto
            if (!token) {
                throw new UnAuthorizedError()
            }
            await AccessTokenUtil.removeToken(token)
            // do logout
            // remove fcm token (if logout form web don't remove fcm token)
            if (!isWeb)
                await UserService.updateUser(req.user.id, {
                    fcmToken: null,
                })
            CookieUtil.clearCookies(res, [KeyConstant.ACCESS_TOKEN_COOKIE_KEY])
            return res.status(StatusCode.OK).json(MyResponse("Logged Out!"))
        } catch (error) {
            return next(error)
        }
    },
}
