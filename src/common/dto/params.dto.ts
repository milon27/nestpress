import { z } from "zod"
import { ZodEmailString, ZodSimpleString } from "../../utils/zod.util"

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
