import { z } from "zod"
import { ZodSimpleString } from "../../../../utils/zod.util"

export const VerifyEmailDto = z
    .object({
        code: ZodSimpleString,
    })
    .strict()

export type IVerifyEmailDto = z.infer<typeof VerifyEmailDto>
