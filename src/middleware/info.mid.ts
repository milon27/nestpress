import { NextFunction, Request, Response } from "express"

export const infoMid = (req: Request, res: Response, next: NextFunction) => {
    const agent = req.headers["user-agent"]?.split("/")[0]
    const isHttps = (req.headers["x-forwarded-proto"] || req.protocol) !== "http"
    req.isHttps = isHttps
    if (agent === "okhttp") {
        // we are from android app.
        req.agent = "android"
    } else if (agent === "PostmanRuntime") {
        req.agent = "postman"
    } else {
        req.agent = "browser"
    }
    next()
}
