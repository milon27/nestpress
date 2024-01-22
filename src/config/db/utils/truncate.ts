import { sql } from "drizzle-orm"
import { MySqlQueryResult } from "drizzle-orm/mysql2"
import { myLogger } from "../../logger"
import { db } from "../db"

export const truncateTables = async () => {
    try {
        // Get the list of tables
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: MySqlQueryResult<string[]> = (await db.execute(sql`SHOW TABLES`)) as any
        const tables = result[0].map((row) => Object.values(row)[0])

        // Truncate each table
        for (const table of tables) {
            await db.execute(sql.raw(`SET FOREIGN_KEY_CHECKS = 0;`))
            if (table !== "__drizzle_migrations") {
                const query = sql.raw(`TRUNCATE TABLE ${table};`)
                myLogger().info(`Table ${table} truncating.`)
                await db.execute(query)
            }
            await db.execute(sql.raw(`SET FOREIGN_KEY_CHECKS = 1;`))
        }
        myLogger().info("All tables truncated successfully.")
        process.exit(0)
    } catch (error) {
        myLogger().error("Error truncating tables:", error)
    }
}

// eslint-disable-next-line no-void
void truncateTables()
