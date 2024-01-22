import { ICurrentUser } from "../common/model/current-user.model"
import { ServerError, UnAuthorizedError } from "../common/model/error.model"
import { ValidityConstant } from "../config/constant/common.constant"
import { KeyConstant } from "../config/constant/key.constant"
import { myLogger } from "../config/logger"
import { UniqueId } from "./common.util"
import { RedisUtil } from "./redis.util"

export const AccessTokenUtil = {
    /**
     * @param payload
     * @returns accessToken, refreshToken
     */
    generateTokens: async (payload: ICurrentUser) => {
        const randomId = UniqueId.createCuid()
        const accessToken = `${payload.id}_${randomId}`
        const tokenAsRedisKey = `${KeyConstant.ACCESS_TOKEN_REDIS_KEY}${accessToken}`
        await RedisUtil.setData(tokenAsRedisKey, payload, ValidityConstant.ACCESS_TOKEN_VALIDITY)
        return { accessToken }
    },
    verifyToken: async (token?: string): Promise<ICurrentUser> => {
        try {
            if (!token) {
                throw new UnAuthorizedError()
            }
            const tokenAsRedisKey = `${KeyConstant.ACCESS_TOKEN_REDIS_KEY}${token}`
            const payload = await RedisUtil.getData<ICurrentUser>(tokenAsRedisKey)
            if (!payload) {
                throw new UnAuthorizedError()
            }
            return payload
        } catch (e) {
            throw new UnAuthorizedError()
        }
    },
    getTokenValue: async (token?: string) => {
        try {
            const tokenAsRedisKey = `${KeyConstant.ACCESS_TOKEN_REDIS_KEY}${token}`
            const user = await RedisUtil.getData<ICurrentUser>(tokenAsRedisKey)
            return user
        } catch (e) {
            throw new UnAuthorizedError()
        }
    },
    updateTokenValue: async (userId: string, body: Partial<ICurrentUser>) => {
        try {
            await RedisUtil.updateObjValues(`${KeyConstant.ACCESS_TOKEN_REDIS_KEY}${userId}_*`, body)
        } catch (e) {
            myLogger().error(`Error while updating token value`, e)
            throw new ServerError()
        }
    },
    removeToken: async (token?: string) => {
        try {
            if (!token) {
                throw new UnAuthorizedError()
            }
            await RedisUtil.deleteData(`${KeyConstant.ACCESS_TOKEN_REDIS_KEY}${token}`)
        } catch (e) {
            throw new UnAuthorizedError()
        }
    },
}
