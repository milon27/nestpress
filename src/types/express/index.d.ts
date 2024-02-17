declare namespace Express {
    type ICurrentUser = import("../../common/model/current-user.model").ICurrentUser

    export interface Request {
        user: ICurrentUser
        agent: "android" | "browser" | "postman"
        isHttps: boolean
        accessToken?: string
    }
}
