import { MyJSON } from "../../common/module/json/my-json.service"
import { myLogger } from "../../config/logger"
import { redisClient } from "../../config/redis/redis.config"
import { KeyValueDataUtil } from "./data.util"
import { RedisHashUtil } from "./hash.util"
import { UpdateExpUtil } from "./update-exp.util"

export const RedisUtil = {
    /**
     * @deprecated not used anywhere in code only used in test
     * @returns an array of { key, value } objects for all keys matching the pattern.
     * Optimized to use a single pipeline for all operations.
     */
    getAllByStream: <T = unknown>(pattern: string): Promise<{ key: string; value: T }[]> => {
        return new Promise<{ key: string; value: T }[]>((resolve, reject) => {
            const stream = redisClient.scanStream({ match: pattern })
            const resultsArr: { key: string; value: T }[] = []
            const allKeys: string[] = []

            stream.on("data", (keys: string[]) => {
                if (keys.length) {
                    allKeys.push(...keys)
                }
            })

            stream.on("end", async () => {
                try {
                    if (allKeys.length === 0) {
                        resolve([])
                        return
                    }

                    // Single pipeline for all keys - eliminates N+1 problem
                    const pipeline = redisClient.pipeline()
                    allKeys.forEach((key) => pipeline.get(key))
                    const results = await pipeline.exec()

                    if (results) {
                        allKeys.forEach((key, index) => {
                            const [err, raw] = results[index]
                            if (err) {
                                myLogger().warn(`Failed to get value for key: ${key}`, err)
                                return
                            }
                            if (raw) {
                                try {
                                    const value: T = MyJSON.parse(raw) as T
                                    resultsArr.push({ key, value })
                                } catch (parseError) {
                                    myLogger().warn(`Failed to parse value for key: ${key}`, parseError)
                                }
                            }
                        })
                    }
                    resolve(resultsArr)
                } catch (err) {
                    myLogger().error("Error in getAllByStream pipeline execution", err)
                    reject(err)
                }
            })

            stream.on("error", (err: unknown) => {
                myLogger().error("Error in scanStream", err)
                reject(err)
            })
        })
    },

    getData: KeyValueDataUtil.getData,
    // do same thing for other set functions as well (use client if provided)
    setData: KeyValueDataUtil.setData,
    deleteData: KeyValueDataUtil.deleteData,

    getHash: RedisHashUtil.getHash,
    /**
     * @description set and update hash data, while update just pass key and partial object, no need to pass complete object and expire time
     */
    setHash: RedisHashUtil.setHash,

    /**
     * @deprecated not used anywhere in code only used in test
     * @param pattern
     */
    deleteByPattern: (pattern: string): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            const stream = redisClient.scanStream({ match: pattern })
            const allKeys: string[] = []

            stream.on("data", (keys: string[]) => {
                if (keys.length > 0) {
                    allKeys.push(...keys)
                }
            })

            stream.on("end", async () => {
                try {
                    if (allKeys.length > 0) {
                        // Single pipeline for all deletions - eliminates N+1 problem
                        const pipeline = redisClient.pipeline()
                        allKeys.forEach((key: string) => {
                            pipeline.del(key)
                        })
                        await pipeline.exec()
                        myLogger().info(`Deleted ${allKeys.length} keys matching pattern: ${pattern}`)
                    } else {
                        myLogger().info(`No keys found matching pattern: ${pattern}`)
                    }
                    resolve()
                } catch (err) {
                    myLogger().error(`Error deleting keys for pattern: ${pattern}`, err)
                    reject(err)
                }
            })

            stream.on("error", (err) => {
                myLogger().error(`Stream error while deleting pattern: ${pattern}`, err)
                reject(err)
            })
        })
    },

    updateExpTime: UpdateExpUtil.updateExp,

    clear: async () => {
        try {
            await redisClient.flushdb()
            myLogger().info("Redis database cleared successfully")
        } catch (error) {
            myLogger().error("Error clearing Redis database", error)
            throw error
        }
    },
}

// const test = async () => {
//     const multi = redisClient.multi()
//     const p = RedisUtil.setDataWithMulti<{ data: string }>({
//         client: multi,
//         key: `concurrent:key`,
//         value: { data: `value` },
//     })
//     await multi.exec()

//     const p2 = RedisUtil.setDataWithMulti({
//         key: `concurrent:key`,
//         value: { data: `value` },
//     })

//     console.log(p, p2)
// }

// test().catch(console.error)
