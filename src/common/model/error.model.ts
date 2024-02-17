/* eslint-disable max-classes-per-file */

import { ErrorCode, StatusCode } from "../../config/constant/code.constant"

export class ServerError extends Error {
    statusCode = StatusCode.SERVER_ERROR

    errorCode = ErrorCode.SERVER_ERROR

    constructor(message = "Internal Server Error", code?: number, errorCode?: ErrorCode) {
        super(message)
        if (code) {
            this.statusCode = code
        }
        if (errorCode) {
            this.errorCode = errorCode
        }
        Object.setPrototypeOf(this, ServerError.prototype)
    }
}

export class NotFoundError extends ServerError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.NOT_FOUND) {
        super(message, StatusCode.NOT_FOUND, errorCode)
    }
}

export class UnAuthorizedError extends ServerError {
    constructor(message = "Authentication failed") {
        super(message, StatusCode.UNAUTHORIZED, ErrorCode.UNAUTHORIZED)
    }
}

export class ForbiddenError extends ServerError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.FORBIDDEN) {
        super(message, StatusCode.FORBIDDEN, errorCode)
    }
}

export class BadRequestError extends ServerError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.BAD_REQUEST) {
        super(message, StatusCode.BAD_REQUEST, errorCode)
    }
}
