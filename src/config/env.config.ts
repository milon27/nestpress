import dotenv from "dotenv"
import fs from "fs"
import path from "path"

const initEnvConfig = () => {
    if (!process.env.parsed) {
        const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env"
        const envFullPath = path.resolve(envPath)

        try {
            fs.accessSync(envFullPath, fs.constants.R_OK)
            console.debug("init", envPath)
            dotenv.config({ path: envFullPath })
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code === "ENOENT") {
                console.debug("init .env")
                dotenv.config({ path: ".env" })
            } else {
                throw err
            }
        }
    } else {
        console.debug("already env loaded")
    }
}

initEnvConfig()

export const EnvConfig = {
    NODE_ENV: process.env.NODE_ENV as "production" | "development" | "test",
    PORT: process.env.PORT,
    TZ: process.env.TZ,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_CLUSTER_ENABLE: process.env.REDIS_CLUSTER_ENABLE,
    REDIS_CLUSTER_URLS: process.env.REDIS_CLUSTER_URLS,
    REDIS_CLUSTER_PORT: process.env.REDIS_CLUSTER_PORT,
    ACCESS_TOKEN_VALIDITY: process.env.ACCESS_TOKEN_VALIDITY,
    LOKI_HOST: process.env.LOKI_HOST,
    LOKI_AUTH: process.env.LOKI_AUTH,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_TRUSTED_ORIGINS: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
}
