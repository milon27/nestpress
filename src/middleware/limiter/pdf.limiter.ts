import rateLimit from "express-rate-limit"
import { ErrorCode } from "../../config/constant/code.constant"
import { ValidityConstant } from "../../config/constant/common.constant"
import { MyErrorResponse } from "../../utils/my-response.util"

/**
 * @description user should logged in before this middleware
 */
export const PdfRateLimiter = rateLimit({
    windowMs: ValidityConstant.PDF_DOWNLOAD_COUNT_EXPIRE * 1000, // 1 day in milliseconds
    max: ValidityConstant.PDF_DOWNLOAD_MAX_COUNT, // limit each IP to 500 requests per windowMs
    message: MyErrorResponse(
        ErrorCode.TOO_MANY_REQUEST,
        `you can only download pdf ${ValidityConstant.PDF_DOWNLOAD_MAX_COUNT} times in ${
            ValidityConstant.PDF_DOWNLOAD_COUNT_EXPIRE / (60 * 60)
        } hours, try again after ${ValidityConstant.PDF_DOWNLOAD_COUNT_EXPIRE / (60 * 60)} hour.`
    ),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
        return `${req.user.id}`
    },
})
