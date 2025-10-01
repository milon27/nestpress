import app from "./app"
import { EnvConfig } from "./config/env.config"
import { myLogger } from "./config/logger"
import { redisClient } from "./config/redis/redis.config"
import { gracefulShutdownServer } from "./config/shutdown.config"

// run the app
const port = EnvConfig.PORT || 4000

redisClient.on("ready", () => {
    myLogger().info("Redis is ready to use!")
})

const server = app.listen(port, () => {
    myLogger().info(`Server Running on port ${port}`)
})
if (server) {
    // graceful shutdown
    gracefulShutdownServer(server)
}
