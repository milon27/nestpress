/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { eq, sql } from "drizzle-orm"
import { MySqlQueryResult } from "drizzle-orm/mysql2"
import { auth } from "../config/auth/auth"
import { db } from "../config/db/db"
import { user as UserSchema } from "../config/db/schema/auth-schema"
import { RedisUtil } from "../utils/redis.util"
import { createUserPayload, loginUserPayload } from "./data"

// create a user and get tokens
const createUser = async () => {
    const user = await db.query.user.findFirst({
        where: eq(UserSchema.email, loginUserPayload.email),
    })
    if (user) {
        const login = await auth.api.signInEmail({
            body: {
                email: loginUserPayload.email,
                password: loginUserPayload.password,
            },
        })
        return login.token
    }
    const newUser = await auth.api.signUpEmail({
        body: {
            ...createUserPayload,
        },
    })
    return newUser.token
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
    await RedisUtil.clear()
}

const getLoggedInUser = async (request: any, accessToken: string) => {
    const res = await request
        .get("/api/auth/get-session")
        .set("Cookie", `better-auth.session_token=${accessToken}`)

    return {
        statusCode: res.status,
        body: res.body,
    }
}

export const TestUtil = {
    getLoggedInUser,
    createUser,
    cleanDbAndRedis,
}
