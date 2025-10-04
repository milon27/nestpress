import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { openAPI } from "better-auth/plugins"
import { db } from "../db/db"
import { EnvConfig } from "../env.config"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
            },
        },
        changeEmail: {
            enabled: true,
        },
    },
    telemetry: {
        enabled: false,
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        openAPI(), // http://localhost:4000/api/auth/reference
    ],
    trustedOrigins: EnvConfig.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") || ["http://localhost:3000"],
})
