import { migrate } from "drizzle-orm/mysql2/migrator"
import path from "path"
import { myLogger } from "../../logger"
import { db } from "../db"

const doMigrate = async () => {
    try {
        const migrationsPath = path.resolve("resources", "drizzle", "migrations")

        await migrate(db, {
            migrationsFolder: migrationsPath,
        })
        myLogger().info("migration done")
        process.exit(0)
    } catch (e) {
        myLogger().error("migration error: ", e)
        process.exit(0)
    }
}
// eslint-disable-next-line no-void
void doMigrate()
