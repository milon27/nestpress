import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { openAPI } from "better-auth/plugins"
import { db } from "../db/db"

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
    trustedOrigins: ["http://localhost:3000"],
})
