import { z } from "zod"
import { ZodEmailString, ZodPasswordString, ZodSimpleString } from "../../../../utils/zod.util"

export const LoginWithEmailDto = z
    .object({
        email: ZodEmailString,
        password: ZodPasswordString,
        fcmToken: ZodSimpleString.max(255).nullish(),
    })
    .strict()

export type ILoginWithEmailDto = z.infer<typeof LoginWithEmailDto>

export const LoginWithGoogleDto = z
    .object({
        idToken: ZodSimpleString,
        fcmToken: ZodSimpleString.max(255).nullish(),
    })
    .strict()
export type ILoginWithGoogleDto = z.infer<typeof LoginWithGoogleDto>
