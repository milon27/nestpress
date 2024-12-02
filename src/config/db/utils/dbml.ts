// eslint-disable-next-line import/no-extraneous-dependencies
import { mysqlGenerate } from "drizzle-dbml-generator" // Using Postgres for this example

import { schemas } from "../db"

mysqlGenerate({
    schema: schemas,
    out: "./resources/dbml/schema.dbml",
    relational: true,
})
