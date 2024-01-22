import type { Config } from "drizzle-kit"

export default {
    schema: "./src/config/db/schema/**/**",
    out: "./resources/drizzle/migrations",
    breakpoints: true,
} satisfies Config
