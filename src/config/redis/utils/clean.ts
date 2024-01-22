import { myLogger } from "../../logger"
import { redisClient } from "../redis.config"

export const cleanRedis = async () => {
    try {
        await redisClient.flushdb()
        myLogger().info("redis cleaned successfully.")
        process.exit(0)
    } catch (error) {
        myLogger().error("Error redis cleaned:", error)
    }
}

// eslint-disable-next-line no-void
void cleanRedis()
