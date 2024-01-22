import { createLogger, format, transports } from "winston"
import LokiTransport from "winston-loki"
import packageJson from "../../../package.json"
import { EnvConfig } from "../env.config"

export const prodLogger = createLogger({
    level: "info",
    format: format.combine(
        format.errors({ stack: true }), // <-- use errors format
        format.timestamp(),
        format.prettyPrint(),
        format.json()
    ),
    transports: [
        new LokiTransport({
            host: `${EnvConfig.LOKI_HOST}`,
            labels: { app: packageJson.name },
            json: true,
            basicAuth: `${EnvConfig.LOKI_AUTH}`,
            format: format.json(),
            replaceTimestamp: true,
        }),
        new transports.Console({
            format: format.combine(format.simple(), format.colorize()),
        }),
    ],
})
