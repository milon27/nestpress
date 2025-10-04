import { NextFunction, Request, Response } from "express"
import { AnyZodObject, ZodTypeAny, z } from "zod"
import { myLogger } from "../config/logger"
import { ErrorCode, StatusCode } from "../constant/code.constant"
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
                body: req.body || {}, //* The req.body property returns undefined when the body has not been parsed. In Express 4, it returns {} by default.
                query: req.query || {},
                params: req.params || {},
            })
            if (reqObjCk.success) {
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
