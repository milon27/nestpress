import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import { EnvConfig } from "../env.config"

import * as user from "./schema/user/user.schema"

const schemas = {
    ...user,
}

export const dbPool = mysql.createPool({
    uri: EnvConfig.DATABASE_URL,
})

// use only in services
export const db = drizzle(dbPool, {
    schema: schemas,
    logger: false,
    mode: "default",
})

export type IDb = typeof db
