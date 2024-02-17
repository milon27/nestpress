import { Router } from "express"
import { HealthCheckController } from "./health-check.controller"

const HealthCheckRouter = Router()

/**
 * @description Check home route
 * @url {{BASE_URL}}/health
 */
HealthCheckRouter.get("/", HealthCheckController.getBasicInfo)

/**
 * @description Check healthCheck route
 * @url {{BASE_URL}}/health/check
 */
HealthCheckRouter.get("/check", HealthCheckController.healthCheck)

/**
 * @description Check db connection
 * @url {{BASE_URL}}/health/db
 */
HealthCheckRouter.get("/db", HealthCheckController.checkDatabaseConnection)

/**
 * @description Check redis connection
 * @url {{BASE_URL}}/health/redis
 */
HealthCheckRouter.get("/redis", HealthCheckController.redisConnectionCheck)

/**
 * @description Check fcm push notification
 * @url {{BASE_URL}}/health/fcm
 */
HealthCheckRouter.get("/fcm", HealthCheckController.fcmCheck)

/**
 * @description logger route
 * @url {{BASE_URL}}/health/logger
 */
HealthCheckRouter.get("/logger", HealthCheckController.logger)

/**
 * @description check header route
 * @url {{BASE_URL}}/health/header
 */
HealthCheckRouter.get("/header", HealthCheckController.checkHeader)

/**
 * @description debug route
 * @url {{BASE_URL}}/health/debug
 */
HealthCheckRouter.get("/debug", HealthCheckController.debug)

export default HealthCheckRouter
