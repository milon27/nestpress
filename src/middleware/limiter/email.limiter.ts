// used for reset password+email verification
import rateLimit from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import { ErrorCode } from "../../config/constant/code.constant"
import { ValidityConstant } from "../../config/constant/common.constant"
import { redisClient } from "../../config/redis/redis.config"
import { MyErrorResponse } from "../../utils/my-response.util"

/**
 * @requires "/:email" in route
 * @param keyPrefix string
 * @returns RateLimitRequestHandler (middleware)
 */
export const emailLimiter = (keyPrefix: string) => {
    return rateLimit({
        windowMs: ValidityConstant.RESET_PASS_RETRY_COUNT_EXPIRE * 1000, // 1 day in milliseconds
        max: ValidityConstant.RESET_PASS_RETRY_MAX_COUNT, // 3 email can be sent
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        // Redis store configuration
        store: new RedisStore({
            prefix: keyPrefix,
            // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
            sendCommand: (...args: string[]) => redisClient.call(...args),
        }),
        keyGenerator: (req) => {
            return `${req.params.email}`
        },
        message: MyErrorResponse(
            ErrorCode.TOO_MANY_REQUEST,
            `you can get ${ValidityConstant.RESET_PASS_RETRY_MAX_COUNT} forget password or email-verification OTP within 24 hours, please try again later. Or contact us in our facebook page.`
        ), // Set the error message to display when the rate limit is exceeded
    })
}
