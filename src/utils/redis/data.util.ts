import Redis, { ChainableCommander } from "ioredis"
import { MyJSON } from "../../common/module/json/my-json.service"
import { myLogger } from "../../config/logger"
import { redisClient } from "../../config/redis/redis.config"

type TypedRedisClientOrTxn = Redis | ChainableCommander

// * get data
async function getData<T>(key: string): Promise<T | undefined> {
    try {
        const data = await redisClient.get(key)
        if (data) return MyJSON.parse(data)
        // if data undefined, should we throw error -> NO?
        return undefined
    } catch (error) {
        myLogger().error(`Error getting data for key: ${key}`, error)
        throw error
    }
}

// * set data with multi
// first signature is used when client is provided
// second signature is used when client is not provided (keep the props but make it optional + set type of undefined - this is important)
// in implementation client type will be : actual type(from 1st signature) + undefined(from 2nd signature) + make it optional(from 2nd signature)

function setData<T>(obj: {
    key: string
    value: T
    expireAfterSeconds?: number
    client: ChainableCommander
}): undefined

function setData<T>(obj: {
    key: string
    value: T
    expireAfterSeconds?: number
    client?: undefined
}): Promise<string>

function setData<T>({
    key,
    value,
    expireAfterSeconds,
    client,
}: {
    key: string
    value: T
    expireAfterSeconds?: number
    client?: ChainableCommander | undefined
}): unknown {
    try {
        const activeClient = client || redisClient

        if (expireAfterSeconds) {
            return (activeClient as TypedRedisClientOrTxn).set(
                key,
                MyJSON.stringify(value),
                "EX",
                expireAfterSeconds
            )
        }
        return (activeClient as TypedRedisClientOrTxn).set(key, MyJSON.stringify(value))
    } catch (error) {
        myLogger().error(`Error setting data for key: ${key}`, error)
        throw error
    }
}

// * Delete data with multi
function deleteData(obj: { key: string; client: ChainableCommander }): undefined
function deleteData(obj: { key: string; client?: undefined }): Promise<number>
function deleteData({ key, client }: { key: string; client?: ChainableCommander | undefined }): unknown {
    try {
        const activeClient = client || redisClient
        return activeClient.del(key)
    } catch (error) {
        myLogger().error(`Error deleting data for key: ${key}`, error)
        throw error
    }
}

// * export all functions
// only be used in redis.util.ts
export const KeyValueDataUtil = {
    getData,
    setData,
    deleteData,
}

// const multi=redisClient.multi()
// const p = SetDataUtil.setData({
//     key: "test",
//     value: { name: "test" },
//     expireAfterSeconds: 10,
//     client: multi,
// })
