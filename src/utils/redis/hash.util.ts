import { ChainableCommander } from "ioredis"
import { MyJSON } from "../../common/module/json/my-json.service"
import { myLogger } from "../../config/logger"
import { redisClient } from "../../config/redis/redis.config"

function serialize(object: Record<string, unknown>): Record<string, string> {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, MyJSON.stringify(value)]))
}

function deserialize<T>(object: Record<string, string>): T {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, MyJSON.parse(value)])) as T
}

async function getHash<T>(key: string): Promise<T | undefined> {
    try {
        const data = await redisClient.hgetall(key)
        if (!data) {
            return undefined
        }
        const deserializedData: Record<string, unknown> = deserialize(data)
        if (Object.keys(deserializedData).length === 0) return undefined
        return deserializedData as T
    } catch (error) {
        myLogger().error(`Error getting hash data for key: ${key}`, error)
        throw error
    }
}

// * this works
// first signature is used when client is provided
// second signature is used when client is not provided (keep the props but make it optional + set type of undefined - this is important)
// in implementation client type will be : actual type(from 1st signature) + undefined(from 2nd signature) + make it optional(from 2nd signature)

function setHash<T extends Record<string, unknown>>(obj: {
    key: string
    object: T
    // expireAfterSeconds?: number
    client: ChainableCommander
}): undefined

function setHash<T extends Record<string, unknown>>(obj: {
    key: string
    object: T
    // expireAfterSeconds?: number
    client?: undefined
}): Promise<string>

function setHash<T extends Record<string, unknown>>({
    key,
    object,
    // expireAfterSeconds,
    client,
}: {
    key: string
    object: T // hash can only store string values
    // expireAfterSeconds?: number
    client?: ChainableCommander | undefined
}): unknown {
    try {
        const activeClient = client || redisClient
        // if (expireAfterSeconds) {
        //     return Promise.all([activeClient.hset(key, serialize(object)), activeClient.expire(key, expireAfterSeconds)])
        // }
        return activeClient.hset(key, serialize(object))
    } catch (error) {
        myLogger().error(`Error setting hash data for key: ${key}`, error)
        throw error
    }
}

// only be used in redis.util.ts
export const RedisHashUtil = {
    getHash,
    setHash,
}
