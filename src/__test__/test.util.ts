import cookie from "cookie"
import { eq, sql } from "drizzle-orm"
import { MySqlQueryResult } from "drizzle-orm/mysql2"
import { auth } from "../config/auth/auth"
import { db } from "../config/db/db"
import { user as UserSchema } from "../config/db/schema/auth-schema"
import { RedisUtil } from "../utils/redis/redis.util"
import { createUserPayload, loginUserPayload } from "./data"

const parseTokenFromCookie = (setCookie: string, tokenName = "better-auth.session_token") => {
    const parsedCookies = cookie.parse(setCookie)
    const sessionToken = parsedCookies[tokenName]
    return sessionToken || "invalid token"
}

const setTokenInRequest = (request: any, accessToken: string, tokenName = "better-auth.session_token") => {
    return request.set("Cookie", `${tokenName}=${accessToken}`)
}

// create a user and get tokens
const createUser = async (request: any) => {
    const user = await db.query.user.findFirst({
        where: eq(UserSchema.email, loginUserPayload.email),
    })
    let accessToken = ""
    if (!user) {
        await auth.api.signUpEmail({
            body: {
                ...createUserPayload,
            },
        })
    }

    const res = await request.post("/api/auth/sign-in/email").send({
        email: loginUserPayload.email,
        password: loginUserPayload.password,
    })
    // Parse cookies from the Set-Cookie header
    const setCookie = res.headers["set-cookie"][0]
    // console.log("setCookie: ", setCookie)
    accessToken = parseTokenFromCookie(setCookie)

    return accessToken
}

const truncateTables = async () => {
    try {
        // Get the list of tables
        const result: MySqlQueryResult<string[]> = (await db.execute(sql`SHOW TABLES`)) as any
        const tables = result[0].map((row) => Object.values(row)[0])
        // Truncate each table
        for (const table of tables) {
            await db.execute(sql.raw(`SET FOREIGN_KEY_CHECKS = 0;`))
            if (table !== "__drizzle_migrations" && table !== "plan") {
                const query = sql.raw(`TRUNCATE TABLE ${table};`)
                // console.log(`Table ${table} truncating.`)
                await db.execute(query)
            }
            await db.execute(sql.raw(`SET FOREIGN_KEY_CHECKS = 1;`))
        }
        console.log("All tables truncated successfully.")
    } catch (error) {
        console.error("Error truncating tables:", error)
    }
}

// clean db + clean redis
const cleanDbAndRedis = async () => {
    await truncateTables() // this will clear the whole db except the plan table
    await RedisUtil.clear() // this will clear the whole redis
}

const getLoggedInUser = async (request: any, accessToken: string) => {
    const res = await setTokenInRequest(request.get("/api/auth/get-session"), accessToken)

    return {
        statusCode: res.status,
        body: res.body,
    }
}

export const TestUtil = {
    setTokenInRequest,
    parseTokenFromCookie,
    getLoggedInUser,
    createUser,
    cleanDbAndRedis,
}
