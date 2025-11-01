import app from "./app"
import { EnvConfig } from "./config/env.config"
import { myLogger } from "./config/logger"
import { gracefulShutdownServer } from "./config/shutdown.config"

// run the app
const port = EnvConfig.PORT || 4000

//! if app require redis, then uncomment codes from redis.config, redis.util. health-check.controller, test.util and clean.ts files. then use redis in other place
// redisClient.on("ready", () => {
//     myLogger().info("Redis is ready to use!")
// })

const server = app.listen(port, () => {
    myLogger().info(`Server Running on port ${port}`)
})
if (server) {
    // graceful shutdown
    gracefulShutdownServer(server)
}
