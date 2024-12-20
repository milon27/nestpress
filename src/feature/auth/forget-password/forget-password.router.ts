import { Router } from "express"
import { EmailParamDto } from "../../../common/dto/params.dto"
import { KeyConstant } from "../../../constant/key.constant"
import { emailLimiter } from "../../../middleware/limiter/email.limiter"
import { validateMid } from "../../../middleware/validate.mid"
import { ResetPasswordDto } from "./dto/forget-password.dto"
import { ForgetPasswordController } from "./forget-password.controller"

const ForgetPasswordRouter = Router()

/**
 * @description get reset password link
 * @url {{BASE_URL}}/auth/forget-password/:email
 */
ForgetPasswordRouter.get(
    "/:email",
    validateMid({ params: EmailParamDto }),
    emailLimiter(KeyConstant.RL_RESET_PASS_MAX_key),
    ForgetPasswordController.getResetOtp
)

/**
 * @description reset password
 * @url {{BASE_URL}}/auth/forget-password
 */
ForgetPasswordRouter.post(
    "/",
    validateMid({ body: ResetPasswordDto }),
    ForgetPasswordController.verifyOtpAndUpdatePassword
)

export default ForgetPasswordRouter
