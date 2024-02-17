import { NextFunction, Request, Response } from "express"
import { IEmailParamDto } from "../../../common/dto/params.dto"
import { BadRequestError, NotFoundError, ServerError } from "../../../common/model/error.model"
import { SendResetPasswordCodeEmail } from "../../../common/module/email/send-email.util"
import { StatusCode } from "../../../config/constant/code.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { MyResponse } from "../../../utils/my-response.util"
import { OtpUtils } from "../../../utils/otp.util"
import { UserService } from "../../user/user.service"
import { IResetPasswordDto } from "./dto/forget-password.dto"

export const ForgetPasswordController = {
    getResetOtp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.params as IEmailParamDto

            const user = await UserService.getUserByIdentifier("email", email)
            if (!user) {
                throw new NotFoundError("No user found with this email!")
            }
            // * only verified user can ask for reset password to ignore spam
            if (!user.isEmailVerified) {
                throw new BadRequestError("Your email is not verified, Contact in our facebook page!")
            }

            const otpCode = await OtpUtils.storeAndGetOtp(KeyConstant.PASS_OTP_PREFIX_KEY, user.id)
            if (!otpCode) {
                throw new ServerError("Not able to generate otp, try again later")
            }
            await SendResetPasswordCodeEmail(user.fullName, user.email, otpCode)
            return res.status(StatusCode.OK).json(MyResponse(`Reset password otp sent to ${user.email}.`))
        } catch (e) {
            return next(e)
        }
    },
    verifyOtpAndUpdatePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code, password } = req.body as IResetPasswordDto

            const userId = await OtpUtils.verifyOtp(KeyConstant.PASS_OTP_PREFIX_KEY, code)
            if (!userId) {
                throw new BadRequestError("Invalid OTP code")
            }
            await UserService.updateUser(userId, {
                password,
            })
            return res.status(StatusCode.OK).json(MyResponse("Reset Password successfully"))
        } catch (e) {
            return next(e)
        }
    },
}
