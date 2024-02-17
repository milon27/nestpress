import { ICurrentUser } from "../../common/model/current-user.model"

declare module "socket.io" {
    interface Socket {
        user?: ICurrentUser
    }
}
