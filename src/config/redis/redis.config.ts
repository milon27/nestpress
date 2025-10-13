import IORedis from "ioredis"
import { EnvConfig } from "../env.config"
import { myLogger } from "../logger"

export let redisClient: IORedis = new IORedis(`${EnvConfig.REDIS_URL}`)

redisClient.on("error", (err) => {
    myLogger().error(err)
})
