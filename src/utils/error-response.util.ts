import { Response } from "express"
import { QueryError } from "mysql2"
import { ServerError } from "../common/model/error.model"
import { ErrorCode, StatusCode } from "../config/constant/code.constant"
import { MyErrorResponse } from "./my-response.util"

const errorResponse = (res: Response, e: unknown) => {
    if (e instanceof ServerError) {
        return res.status(e.statusCode).json(MyErrorResponse(e.errorCode, (e as Error).message))
    }
    const error = e as QueryError
    let code = ErrorCode.SERVER_ERROR
    let statusCode = StatusCode.SERVER_ERROR
    let errorMessage = error.message

    if (error.code === "ER_DUP_ENTRY") {
        code = ErrorCode.ALREADY_USED
        statusCode = StatusCode.BAD_REQUEST
        errorMessage = "This is already created!"
        if (error.message.includes("email_unique")) {
            errorMessage = "Email already used, use another email!"
        }
    }

    return res.status(statusCode).json(MyErrorResponse(code, errorMessage))
}
export default errorResponse
