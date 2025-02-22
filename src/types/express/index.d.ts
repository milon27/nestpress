declare namespace Express {
    type ICurrentUser = import("../../common/model/current-user.model").ICurrentUser

    export interface Request {
        user: ICurrentUser
        agent: "android" | "browser" | "postman" | "safari"
        isHttps: boolean
        accessToken?: string
    }
}
