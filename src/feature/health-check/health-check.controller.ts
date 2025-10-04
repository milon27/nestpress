import { sql } from "drizzle-orm"
import { Request, Response } from "express"
import { DbService } from "../../common/module/db/db.service"
import { db } from "../../config/db/db"
import { EnvConfig } from "../../config/env.config"
import { myLogger } from "../../config/logger"
import { ErrorCode, StatusCode } from "../../constant/code.constant"
import { CommonUtil } from "../../utils/common.util"
import { MyErrorResponse, MyResponse } from "../../utils/my-response.util"

export const HealthCheckController = {
    getBasicInfo: (req: Request, res: Response) => {
        if (EnvConfig.NODE_ENV) {
            res.send(`Running app in ${EnvConfig.NODE_ENV} , TZ:${EnvConfig.TZ || "UTC"}... 🚀`)
        } else {
            res.status(StatusCode.SERVER_ERROR).send("something went wrong")
        }
    },
    healthCheck: async (req: Request, res: Response) => {
        try {
            // db check
            const dbResult = await DbService.executeRaw<{ time: string }>(db, sql`select now() as time;`)
            //! if app require redis, then uncomment this code. then use redis in other place
            // redis check
            // await RedisUtil.setData("example-test-redis", "redis working", 30)
            // const redisResult = await RedisUtil.getData("example-test-redis")
            // env check
            const envResult = EnvConfig.NODE_ENV
            res.status(StatusCode.OK).send(MyResponse("health-check", { dbResult, envResult }))
            // res.status(StatusCode.OK).send(MyResponse("health-check", { dbResult, redisResult, envResult }))
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).send(
                MyErrorResponse(ErrorCode.SERVER_ERROR, `health-check error ${(e as Error).message}`)
            )
        }
    },
    checkDatabaseConnection: async (req: Request, res: Response) => {
        try {
            const result = await DbService.executeRaw<{ time: string }>(db, sql`select now() as time;`)
            res.status(StatusCode.OK).send(MyResponse("db connected", result))
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).send(
                MyErrorResponse(ErrorCode.SERVER_ERROR, `db not connected ${(e as Error).message}`)
            )
        }
    },
    redisConnectionCheck: async (req: Request, res: Response) => {
        try {
            //! if app require redis, then uncomment this code. then use redis in other place
            // await RedisUtil.setData("example-test-redis", "redis working", 30)
            // const result = await RedisUtil.getData("example-test-redis")
            // res.status(StatusCode.OK).send(MyResponse("redis connected", result))
            res.status(StatusCode.OK).send(MyResponse("redis isn't connected on this server", false))
        } catch (e) {
            myLogger().error(e)
            res.status(StatusCode.SERVER_ERROR).send(
                MyErrorResponse(
                    ErrorCode.SERVER_ERROR,
                    (e as Error).message.replace(/[|&;$%@"<>()+,]/g, "").replaceAll("\n", "")
                )
            )
        }
    },

    logger: (req: Request, res: Response) => {
        myLogger().info("this is a info")
        myLogger().error("this is a error custom message", new Error("test error"))
        myLogger().debug("this is a debug message")

        return res.send({ message: "logger working fine" })
    },
    checkHeader: (req: Request, res: Response) => {
        return res.send({
            ip: req.ip || "req.ip not found",
            ...req.headers,
        })
    },
    debug: async (req: Request, res: Response) => {
        await CommonUtil.fakeAwait()
        return res.send({ message: "working fine" })
    },
}
