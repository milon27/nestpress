import { z } from "zod"
import { Constant } from "../config/constant/common.constant"

export const ZodNameString = z
    .string()
    .trim()
    .regex(Constant.NAME_STRING, "Only Bengali or English characters, number, space are allowed")
    .nonempty("It's Required")

export const ZodNumericString = z
    .string()
    .trim()
    .regex(new RegExp(Constant.STRING_NUM_PATTERN), "Only number is allowed")
    .nonempty("It's Required")

export const ZodNumericNonNegString = z
    .string()
    .trim()
    .regex(new RegExp(Constant.STRING_NUM_PATTERN_NON_NEG), "Only positive number is allowed")

export const ZodSimpleString = z.string().trim().nonempty("It's Required")

export const ZodSimpleEmptyString = z.string().trim()

export const ZodEmailString = z
    .string()
    .toLowerCase()
    .trim()
    .max(255)
    .email("Invalid email address")
    .nonempty("It's Required")

export const ZodPasswordString = z
    .string()
    .trim()
    .min(6, "minium 6 character long")
    .max(150, "max 150 character long")

export const ZodTimeString = z
    .string()
    .trim()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
    .nonempty("It's Required")

export const ZodDateString = z.string().trim().datetime().nonempty("It's Required")
export const ZodDateStringOptional = z.string().trim().datetime().optional()

export const ZodOnlyDateString = z
    .string()
    .trim()
    .datetime()
    .nonempty("It's Required")
    .transform((value) => {
        return value.split("T")[0]
    })

// at least update 1 refine method
export const ZodMin1UpdateRefine = (data: NonNullable<unknown>) => {
    const isAllUndefinedOrNull = Object.values(data).every((value) => value === undefined || value === null)
    if (isAllUndefinedOrNull) {
        return false
    }
    return true
}
