import rateLimit from "express-rate-limit"
import { ErrorCode } from "../../config/constant/code.constant"
import { ValidityConstant } from "../../config/constant/common.constant"
import { MyErrorResponse } from "../../utils/my-response.util"

export const globalRateLimiter = rateLimit({
    windowMs: ValidityConstant.API_HIT_COUNT_EXPIRE * 1000, // 15 minutes in ms
    max: ValidityConstant.API_HIT_MAX_COUNT, // limit each IP to 500 requests per windowMs
    message: MyErrorResponse(
        ErrorCode.TOO_MANY_REQUEST,
        "Too many requests from this IP, please try again after 15 minutes"
    ),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => (req.headers["x-forwarded-for"] as string) || (req.headers["x-real-ip"] as string),
})
