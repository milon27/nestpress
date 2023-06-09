import app from "./app"
import { myLogger } from "./config/logger"
import { redisClient } from "./config/redis.config"
import { shutdownServer } from "./config/shutdown.config"

// run the app
const port = process.env.PORT || 4000

redisClient.on("ready", () => {
    myLogger().info("Redis is ready to use!")
})
const server = app.listen(port, () => {
    myLogger().info(`Server Running on ${process.env.BASE_API_URL}`)
})
if (server) {
    // graceful shutdown
    shutdownServer(server)
}
