import { createId } from "@paralleldrive/cuid2"
import { ulid } from "ulid"
import { EnvConfig } from "../config/env.config"

// common utility functions
export const CommonUtil = {
    getLimitOffset: (page: number, size: number) => {
        const limit = EnvConfig.NODE_ENV === "test" ? 500 : size
        const offset = (page - 1) * limit
        return {
            limit,
            offset,
        }
    },
    convertArrayToObject: <T extends string>(arr: readonly T[]): Record<T, T> => {
        return arr.reduce(
            (obj, value) => {
                // eslint-disable-next-line no-param-reassign
                obj[value] = value
                return obj
            },
            {} as Record<T, T>
        )
    },
    fakeAwait: () => {
        return Promise.resolve(true)
    },
}

export const UniqueId = {
    createCuid: () => {
        return createId() // only the token
    },
    createUlid: () => {
        return ulid() // all primary keys
    },
}
