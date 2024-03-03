import { NextFunction, Request, Response } from "express"
import { NotFoundError, ServerError } from "../../../common/model/error.model"
import { ErrorCode, StatusCode } from "../../../config/constant/code.constant"
import { Constant } from "../../../config/constant/common.constant"
import { MyResponse } from "../../../utils/my-response.util"
import { UserService } from "../../user/user.service"
import { ILoginWithEmailDto, ILoginWithGoogleDto } from "./dto/login.dto"
import { IRegisterDto, RegisterProvider } from "./dto/register.dto"
import { LoginRegisterService } from "./login-register.service"

export const LoginRegisterController = {
    loginWithEmail: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password, fcmToken } = req.body as ILoginWithEmailDto

            // check user is available or not in db
            const user = await LoginRegisterService.validateUser(email, password, fcmToken)
            if (!user) {
                throw new NotFoundError(`Wrong email or password`, ErrorCode.WRONG_CREDENTIALS)
            }
            return await LoginRegisterService.sendTokenResponse(req, res, user, "logged-in successfully")
        } catch (e) {
            return next(e)
        }
    },
    loginRegisterWithGoogle: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { idToken, fcmToken } = req.body as ILoginWithGoogleDto

            // check user is available or not in db
            const tokenPayload = await LoginRegisterService.verifyGoogleIdToken(idToken)
            const user = await LoginRegisterService.validateUser(tokenPayload.email, undefined, fcmToken)
            if (!user) {
                // tell them to send to complete profile screen
                return res
                    .status(StatusCode.OK)
                    .send(
                        MyResponse(
                            "Google Authentication successful, complete the user profile and signup!",
                            tokenPayload
                        )
                    )
            }
            return await LoginRegisterService.sendTokenResponse(req, res, user, "user logged-in successfully")
        } catch (e) {
            return next(e)
        }
    },
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as IRegisterDto
            const user = await UserService.registerAndGetUser(
                body.provider === RegisterProvider.simple
                    ? body.user
                    : { ...body.user, password: Constant.GOOGLE_PASSWORD },
                body.provider === RegisterProvider.google
            )
            if (!user) {
                throw new ServerError(`Something went wrong while registering user`)
            }
            return await LoginRegisterService.sendTokenResponse(req, res, user, "user registered successfully")
        } catch (e) {
            return next(e)
        }
    },
}
