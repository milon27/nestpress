import { Server as HttpServer } from "http"
import { Server } from "socket.io"
import { checkIsLoggedInMidForWs } from "../../middleware/socket-auth.mid"
import { myLogger } from "../logger"

export const webSocketConfig = (server: HttpServer) => {
    const ioServer = new Server(server, {
        cors: {
            origin: true,
        },
        transports: ["websocket"],
    })

    ioServer.use(async (socket, next) => {
        await checkIsLoggedInMidForWs(socket, next)
    })

    ioServer.on("connection", (socket) => {
        myLogger().info(`a socket connected -> ${socket.id}`)
        // TODO: Handling socket connections.

        // disconnect
        socket.on("disconnect", () => {
            myLogger().info(`socket ${socket.id} disconnected`)
        })
    })
}
