import { myLogger } from "../../logger"

export const cleanRedis = async () => {
    try {
        //! if app require redis, then uncomment this code. then use redis in other place
        // await redisClient.flushdb()
        myLogger().info("redis cleaned successfully.")
        process.exit(0)
    } catch (error) {
        myLogger().error("Error redis cleaned:", error)
    }
}

// eslint-disable-next-line no-void
void cleanRedis()
