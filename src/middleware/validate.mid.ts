import { NextFunction, Request, Response } from "express"
import { AnyZodObject, ZodTypeAny, z } from "zod"
import { ErrorCode, StatusCode } from "../config/constant/code.constant"
import { myLogger } from "../config/logger"
import { MyErrorResponse } from "../utils/my-response.util"

export const validateMid = ({
    body,
    params,
    query,
}: {
    body?: ZodTypeAny
    params?: AnyZodObject
    query?: AnyZodObject
}) => {
    const schema = z.object({
        body: body || z.object({}),
        params: params || z.object({}),
        query: query || z.object({}),
    }) as AnyZodObject
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const reqObjCk = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            })
            if (reqObjCk.success) {
                req.query = reqObjCk.data.query
                req.body = reqObjCk.data.body
                req.params = reqObjCk.data.params
                return next()
            }

            // const errors2 = reqObjCk.error.errors.map((item) => {
            //     return {
            //         path: item.path.toString().replaceAll(",", "."),
            //         message: item.message,
            //         code: item.code,
            //     }
            // })

            const errors = reqObjCk.error.format()
            myLogger().error(errors)
            return res.status(StatusCode.BAD_REQUEST).send(MyErrorResponse(ErrorCode.BAD_REQUEST, errors))
        } catch (err) {
            myLogger().error(err)
            return res
                .status(StatusCode.BAD_REQUEST)
                .send(MyErrorResponse(ErrorCode.BAD_REQUEST, "Invalid Request Body!"))
        }
    }
}
