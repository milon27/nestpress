// eslint-disable-next-line import/no-extraneous-dependencies
import { mysqlGenerate } from "drizzle-dbml-generator" // Using Postgres for this example
import * as schemas from "../schema/index"

mysqlGenerate({
    schema: schemas,
    out: "./resources/dbml/schema.dbml",
    relational: true,
})
