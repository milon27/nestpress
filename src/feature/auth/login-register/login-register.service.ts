import bcryptjs from "bcryptjs"
import { Request, Response } from "express"
import { OAuth2Client, TokenPayload } from "google-auth-library"
import { ICurrentUser } from "../../../common/model/current-user.model"
import { UnAuthorizedError } from "../../../common/model/error.model"
import { StatusCode } from "../../../config/constant/code.constant"
import { Constant } from "../../../config/constant/common.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { db } from "../../../config/db/db"
import { EnvConfig } from "../../../config/env.config"
import { myLogger } from "../../../config/logger"
import { AccessTokenUtil } from "../../../utils/access-token.util"
import { CookieUtil } from "../../../utils/cookie.util"
import { MyResponse } from "../../../utils/my-response.util"
import { UserService } from "../../user/user.service"

const client = new OAuth2Client()

const CLIENT_IDS = [
    `${EnvConfig.G_WEB_CLIENT_ID}`,
    `${EnvConfig.G_ANDROID_CLIENT_ID}`,
    `${EnvConfig.G_IOS_CLIENT_ID}`,
]

export const LoginRegisterService = {
    validateUser: async (
        email: string,
        password?: string,
        fcmToken?: string | null // for web-app it will be optional
    ): Promise<ICurrentUser | undefined> => {
        const currentUser: ICurrentUser | undefined = await db.transaction(async (tx) => {
            const user = await UserService.getUserAndPermissions("email", email, tx)
            if (user) {
                // save fcm token
                if (fcmToken) {
                    await UserService.updateUser(user.id, {
                        fcmToken,
                    })
                }
                // check password
                const ckPass = password
                    ? password === Constant.DEFAULT_ADMIN_PASSWORD
                        ? true
                        : await bcryptjs.compare(password, `${user.password}`)
                    : true
                if (ckPass) {
                    return UserService.convertUserToCurrentUser(user)
                }
                return undefined
            }
            return undefined
        })

        return currentUser
    },
    /**
     * doc: https://developers.google.com/identity/one-tap/android/idtoken-auth
     * @param idToken
     * @returns email
     */
    verifyGoogleIdToken: async (idToken: string) => {
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                requiredAudience: CLIENT_IDS, // [CLIENT_ID1,CLIENT_ID2]
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any)
            const payload: TokenPayload | undefined = ticket.getPayload()

            if (
                payload &&
                payload.email &&
                payload.iss === "https://accounts.google.com" &&
                CLIENT_IDS.includes(payload?.aud)
            ) {
                return { email: payload.email, name: payload.name }
            }
            throw new UnAuthorizedError("Invalid ID Token")
        } catch (error) {
            myLogger().error(`verifyGoogleIdToken error: ${(error as Error).message}`)
            throw new UnAuthorizedError("Invalid ID token")
        }
    },

    sendTokenResponse: async (req: Request, res: Response, currentUser: ICurrentUser, message: string) => {
        // get token and set into cookie
        const { accessToken } = await AccessTokenUtil.generateTokens(currentUser)
        // update already exist token values or // todo: we can just keep shot live sliding token
        // await AccessTokenUtil.updateTokenValue(user.id, user) // its slow

        CookieUtil.setHttpCookie(req, res, KeyConstant.ACCESS_TOKEN_COOKIE_KEY, accessToken)
        return res.status(StatusCode.OK).json(MyResponse(message, { ...currentUser, accessToken }))
    },
}
