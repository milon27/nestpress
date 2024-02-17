import { Server } from "http"
import { myLogger } from "./logger"
import { dbPool } from "./db/db"

export const gracefulShutdownServer = (server: Server) => {
    const closeServerAndDb = (message: string) => {
        server.close(async () => {
            myLogger().info(message)
            await dbPool.end()
            process.exit(0)
        })
    }

    const unexpectedErrorHandler = (error: Error) => {
        myLogger().error(error)
        closeServerAndDb("unexpectedErrorHandler : Server closed")
    }

    process.on("SIGTERM", () => {
        closeServerAndDb("Server closed by SIGTERM")
    })
    process.on("SIGINT", () => {
        closeServerAndDb("Server closed by SIGINT")
    })
    process.on("uncaughtException", unexpectedErrorHandler)
    process.on("unhandledRejection", unexpectedErrorHandler)
}
