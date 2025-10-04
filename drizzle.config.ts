import type { Config } from "drizzle-kit"
import { EnvConfig } from "./src/config/env.config"

export default {
    dialect: "mysql",
    dbCredentials: {
        url: EnvConfig.DATABASE_URL!,
    },
    schema: "./src/config/db/schema",
    out: "./resources/drizzle/migrations",
    breakpoints: true,
} satisfies Config
