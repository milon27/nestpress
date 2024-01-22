import { EnvConfig } from "../env.config"

export const Constant = {
    DEFAULT_PASSWORD: "123456",
    GOOGLE_PASSWORD: "nestpress1234",
    DEFAULT_ADMIN_PASSWORD: "nestpress1234",
    EMPTY: "EMPTY",
    CURRENCY: "usd",
    TIMEZONE: "Asia/Dhaka",
    PAGE_SIZE: 10, // 10
    NAME_STRING: /^[a-zA-Z0-9\u0980-\u09FF_ -]+$/u,
    STRING_NUM_SPACE_PATTERN: "^[a-zA-Z0-9 _-]+$",
    STRING_NUM_PATTERN: `^-?(\\d?)+(\\.\\d+)?$`, // ^[0-9.]+$
    STRING_NUM_PATTERN_NON_NEG: `^(\\d?)+(\\.\\d+)?$`, // ^[0-9.]+$
    MAX_NUM_AMOUNT: 1_000_000, // one million
} as const

export const ValidityConstant = {
    ACCESS_TOKEN_VALIDITY: Number(EnvConfig.ACCESS_TOKEN_VALIDITY || 7) * 86400, // 7 days in seconds
    API_HIT_MAX_COUNT: 1000,
    API_HIT_COUNT_EXPIRE: 15 * 60, // 15 minutes in seconds
    RESET_PASS_RETRY_MAX_COUNT: 3,
    RESET_PASS_RETRY_COUNT_EXPIRE: 1 * 86400, // 1 day in seconds
    PDF_DOWNLOAD_MAX_COUNT: 3,
    PDF_DOWNLOAD_COUNT_EXPIRE: 6 * 60 * 60, // 6 * 60 minutes in seconds / 6 hours in seconds
} as const
