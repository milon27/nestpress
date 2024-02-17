import IORedis, { Cluster } from "ioredis"
import { EnvConfig } from "../env.config"
import { myLogger } from "../logger"

// * without cluster config
let redisClientOrCluster: Cluster | IORedis
if (EnvConfig.ENABLE_SOCKET === "true" && EnvConfig.NODE_ENV !== "production") {
    // ! Not Used (redisClientOrCluster.isCluster use if needed)
    // const clusters = `${EnvConfig.REDIS_CLUSTER_URLS}`.split(",").map((url) => {
    //     return {
    //         host: url,
    //         port: +`${EnvConfig.REDIS_CLUSTER_PORT}`,
    //     } as ClusterNode
    // })
    // redisClientOrCluster = new IORedis.Cluster(clusters)
    // ! for now used regular instead of cluster
    redisClientOrCluster = new IORedis(`${EnvConfig.REDIS_URL}`)
} else if (EnvConfig.NODE_ENV !== "production") {
    redisClientOrCluster = new IORedis(`${EnvConfig.REDIS_URL}`)
} else {
    redisClientOrCluster = new IORedis(`${EnvConfig.REDIS_URL}`)
}

export const redisClient = redisClientOrCluster

redisClient.on("error", (err) => {
    myLogger().error(err)
})
