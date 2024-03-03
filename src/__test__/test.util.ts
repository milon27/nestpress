/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { sql } from "drizzle-orm"
import { MySqlQueryResult } from "drizzle-orm/mysql2"
import { KeyConstant } from "../config/constant/key.constant"
import { db } from "../config/db/db"
import { UserService } from "../feature/user/user.service"
import { AccessTokenUtil } from "../utils/access-token.util"
import { RedisUtil } from "../utils/redis.util"
import { createUserPayload, loginUserPayload } from "./data"

// create a user and get tokens
const createUser = async () => {
    const user = await UserService.getUserAndPermissions("email", loginUserPayload.email)
    if (user) {
        const tokenValue = UserService.convertUserToCurrentUser(user)
        return AccessTokenUtil.generateTokens(tokenValue)
    }
    const newUser = await UserService.registerAndGetUser({
        ...createUserPayload.user,
        password: loginUserPayload.password,
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tokens = await AccessTokenUtil.generateTokens(newUser!)
    return tokens
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
    const { statusCode, body } = await request
        .post("/v1/user")
        .set("Cookie", `${KeyConstant.ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
    return {
        statusCode,
        body,
    }
}

export const TestUtil = {
    getLoggedInUser,
    createUser,
    cleanDbAndRedis,
}
