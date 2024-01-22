import { Socket } from "socket.io"
import { ExtendedError } from "socket.io/dist/namespace"
import { myLogger } from "../config/logger"
import { AccessTokenUtil } from "../utils/access-token.util"

export const checkIsLoggedInMidForWs = async (socket: Socket, next: (error?: ExtendedError) => void) => {
    try {
        const { token } = socket.handshake.auth
        // token validation
        const user = await AccessTokenUtil.verifyToken(token)
        // eslint-disable-next-line no-param-reassign
        socket.user = user
        next()
    } catch (e) {
        myLogger().error("socket checkIsLoggedInMidForWs error", e)
        next(e as ExtendedError)
    }
}
