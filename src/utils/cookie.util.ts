import { CookieOptions, Request, Response } from "express"
import { EnvConfig } from "../config/env.config"

export const CookieUtil = {
    setHttpCookie: (req: Request, res: Response, key: string, value: string) => {
        res.cookie(key, value, CookieUtil.getSessionCookieOption(req.isHttps, req.agent))
    },
    clearCookies: (res: Response, keys: string[]) => {
        keys.forEach((key) => {
            res.cookie(key, "", {
                httpOnly: true,
                secure: true,
                sameSite: "none", // lax or none
                expires: new Date(0),
            })
        })
    },
    getSessionCookieOption: (
        isHttps: boolean,
        agent: "browser" | "postman" | "android" | "safari" = "android"
    ) => {
        if (EnvConfig.NODE_ENV === "development") {
            if (agent === "safari") {
                return {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 365 * 24 * 60 * 60 * 1000, // 365*1 day in milliseconds
                } as CookieOptions
            }

            if (agent === "browser") {
                return {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none", // EnvConfig.NODE_ENV === "development" ? "none" : isHttps === false ? "lax" : "none", // lax or none
                    maxAge: 365 * 24 * 60 * 60 * 1000, // 365*1 day in milliseconds
                } as CookieOptions
            }
            if (agent === "postman") {
                return {
                    httpOnly: true,
                    secure: false,
                    sameSite: "none", // lax or none
                    maxAge: 365 * 24 * 60 * 60 * 1000, // 365*1 day in milliseconds
                } as CookieOptions
            }
            // mobile
            return {
                httpOnly: true,
                secure: false,
                sameSite: "none", // lax or none
                // maxAge: 1 * 24 * 60 * 60 * 1000//
            } as CookieOptions
        }

        // 3rd party= secure: true && sameSite: 'none'
        // 1st party= secure: true/false && samesite:'lax'
        // dev
        // secure: false && sameSite: 'lax'
        // production
        // secure: true && sameSite: 'lax' (1st party)
        // secure: true && sameSite: 'none' (3rd party)
        if (agent === "browser" || agent === "safari") {
            return {
                httpOnly: true,
                secure: isHttps,
                sameSite: "none", // EnvConfig.NODE_ENV === "development" ? "none" : isHttps === false ? "lax" : "none", // lax or none
                maxAge: 365 * 24 * 60 * 60 * 1000, // 365*1 day in milliseconds
            } as CookieOptions
        }
        if (agent === "postman") {
            return {
                httpOnly: true,
                secure: true,
                sameSite: "none", // lax or none
                maxAge: 365 * 24 * 60 * 60 * 1000, // 365*1 day in milliseconds
            } as CookieOptions
        }
        // mobile
        return {
            httpOnly: true,
            secure: true,
            sameSite: "none", // lax or none
            // maxAge: 1 * 24 * 60 * 60 * 1000//
        } as CookieOptions
    },
}
