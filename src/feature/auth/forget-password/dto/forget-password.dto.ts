import { z } from "zod"
import { ZodPasswordString, ZodSimpleString } from "../../../../utils/zod.util"

export const ResetPasswordDto = z
    .object({
        code: ZodSimpleString,
        password: ZodPasswordString,
    })
    .strict()

export type IResetPasswordDto = z.infer<typeof ResetPasswordDto>
