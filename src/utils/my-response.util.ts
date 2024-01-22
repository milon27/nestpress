import { z } from "zod"
import { ErrorCode, StatusCode } from "../config/constant/code.constant"

export const MyResponse = <T>(message: string, response?: T, statusCode = StatusCode.OK) => {
    return {
        message,
        statusCode,
        response,
    }
}

export const MyErrorResponse = (
    errorCode = ErrorCode.SERVER_ERROR,
    message?:
        | string
        | {
              path: string
              message: string
              code: string
          }[]
        | z.ZodFormattedError<
              {
                  [x: string]: unknown
              },
              string
          >
) => {
    return {
        errorCode,
        message,
    }
}
