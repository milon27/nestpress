import { EnvConfig } from "../env.config"
import { devLogger } from "./dev.logger"
import { prodLogger } from "./prod.logger"

export const myLogger = () => {
    if (EnvConfig.NODE_ENV === "development") {
        return devLogger
    }
    if (EnvConfig.NODE_ENV === "test") {
        return devLogger
    }
    return prodLogger
}

// @use : myLogger().error('error message',error)
// @use : myLogger().info('info message')
