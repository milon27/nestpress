import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../config/constant/code.constant"
import { ValidityConstant } from "../../../config/constant/common.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { MyResponse } from "../../../utils/my-response.util"
import { RedisUtil } from "../../../utils/redis.util"

export const TokenController = {
    verifyToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user } = req

            // Increase TTL for token if open the app
            const tokenAsRedisKey = `${KeyConstant.ACCESS_TOKEN_REDIS_KEY}${req.accessToken}`
            await RedisUtil.updateExpTime(tokenAsRedisKey, ValidityConstant.ACCESS_TOKEN_VALIDITY)

            return res.status(StatusCode.OK).send(MyResponse("user already logged in", user))
        } catch (error) {
            return next(error)
        }
    },
}
