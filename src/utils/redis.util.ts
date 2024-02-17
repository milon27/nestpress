import { MyJSON } from "../common/module/json/my-json.service"
import { myLogger } from "../config/logger"
import { redisClient } from "../config/redis/redis.config"

export const RedisUtil = {
    getData: async <T>(key: string): Promise<T | undefined> => {
        const data = await redisClient.get(key)
        if (data) return MyJSON.parse(data)
        return undefined
    },
    setData: async <T>(key: string, value: T, expireAfterSeconds?: number): Promise<boolean> => {
        let data
        if (expireAfterSeconds) {
            data = await redisClient.set(key, MyJSON.stringify(value), "EX", expireAfterSeconds)
        } else {
            data = await redisClient.set(key, MyJSON.stringify(value))
        }
        if (data) return true
        return false
    },
    deleteData: async (key: string) => {
        await redisClient.del(key)
    },
    deleteByPattern: (pattern: string) => {
        // Create a readable stream (object mode)
        const stream = redisClient.scanStream({
            match: pattern,
        })
        stream.on("data", async (keys) => {
            // `keys` is an array of strings representing key names
            if (keys.length && keys.length > 0) {
                const pipeline = redisClient.pipeline()
                keys.forEach((key: string) => {
                    pipeline.del(key)
                })
                await pipeline.exec()
            }
        })
        stream.on("end", () => {
            myLogger().info("all keys deleted")
        })

        // or you can use this library
        // import redisDelByPattern, { RedisDeletionMethod } from "@eturino/ioredis-del-by-pattern"
        // await redisDelByPattern({
        //     pattern,
        //     redis: redisClient, // ioredis client
        //     withPipeline: true,
        //     deletionMethod: RedisDeletionMethod.unlink,
        // })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateObjValues: async (prefix: string, newValue: any): Promise<void> => {
        // Fetch keys matching the prefix
        const keys = await redisClient.keys(`${prefix}*`)

        // Create a pipeline to batch the update commands
        const pipeline = redisClient.pipeline()

        // Update the values of matching keys
        for (const key of keys) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const old = await RedisUtil.getData<any>(key)
            const updatedValue = { ...old, ...newValue }
            pipeline.set(key, MyJSON.stringify(updatedValue))
        }

        // Execute the pipeline
        await pipeline.exec()
    },
    updateExpTime: async (key: string, expireAfterSeconds: number) => {
        await redisClient.expire(key, expireAfterSeconds)
    },
    clear: async () => {
        await redisClient.flushdb()
    },
}
