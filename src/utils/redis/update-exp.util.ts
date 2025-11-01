import { ChainableCommander } from "ioredis"
import { myLogger } from "../../config/logger"
import { redisClient } from "../../config/redis/redis.config"

// * this works
// first signature is used when client is provided
// second signature is used when client is not provided (keep the props but make it optional + set type of undefined - this is important)
// in implementation client type will be : actual type(from 1st signature) + undefined(from 2nd signature) + make it optional(from 2nd signature)

function updateExp(obj: { key: string; expireAfterSeconds: number; client: ChainableCommander }): undefined

function updateExp(obj: { key: string; expireAfterSeconds: number; client?: undefined }): Promise<number>

function updateExp({
    key,
    expireAfterSeconds,
    client,
}: {
    key: string
    expireAfterSeconds: number
    client?: ChainableCommander | undefined
}): unknown {
    try {
        const activeClient = client || redisClient

        return activeClient.expire(key, expireAfterSeconds)
    } catch (error) {
        myLogger().error(`Error setting data for key: ${key}`, error)
        throw error
    }
}

// only be used in redis.util.ts
export const UpdateExpUtil = {
    updateExp,
}
