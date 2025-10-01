declare namespace Express {
    type IUser = import("../../config/db/schema/auth-schema").IUser

    export interface Request {
        user: IUser
        token: string
    }
}
