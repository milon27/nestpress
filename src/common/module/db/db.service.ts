import { SQLWrapper } from "drizzle-orm"
import { MySqlRawQueryResult } from "drizzle-orm/mysql2"
import { IDb } from "../../../config/db/db"

export const DbService = {
    executeRaw: async <T>(db: IDb, query: SQLWrapper): Promise<T[]> => {
        const result: MySqlRawQueryResult = await db.execute(query)
        return result[0] as unknown as T[]
    },
}
