import { z } from "zod"
import { Constant } from "../../config/constant/common.constant"
import { ZodEmailString, ZodNumericString, ZodSimpleString } from "../../utils/zod.util"

export const EmailParamDto = z
    .object({
        email: ZodEmailString,
    })
    .strict()

export type IEmailParamDto = z.infer<typeof EmailParamDto>

export const IdParamDto = z
    .object({
        id: ZodSimpleString,
    })
    .strict()

export type IIdParamDto = z.infer<typeof IdParamDto>

export const SlugParamDto = z
    .object({
        slug: ZodSimpleString,
    })
    .strict()

export type ISlugParamDto = z.infer<typeof SlugParamDto>

export const GetAllQueryParamDto = z
    .object({
        page: ZodNumericString.optional().default("1"),
        size: ZodNumericString.optional().default(Constant.PAGE_SIZE.toString()),
    })
    .strict()

export type IGetAllQueryParamDto = z.infer<typeof GetAllQueryParamDto>
