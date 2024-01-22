/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatISO, parseISO } from "date-fns"

const serialize = (key: string, value: any) => {
    if (value instanceof Date) {
        return formatISO(value)
    }
    return value
}

const deserialize = (key: string, value: any): any => {
    if (typeof value === "string") {
        const parsedDate = parseISO(value)
        if (!Number.isNaN(parsedDate.getTime())) {
            return parsedDate
        }
    }
    return value
}

export const MyJSON = {
    stringify: (obj: any) => {
        return JSON.stringify(obj, serialize)
    },
    parse: (obj: any) => {
        return JSON.parse(obj, deserialize)
    },
}
