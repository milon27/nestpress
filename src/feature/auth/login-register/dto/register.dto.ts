import { z } from "zod"
import { ZodSimpleString } from "../../../../utils/zod.util"
import { CreateUserDto } from "../../../user/dto/user.dto"

export enum RegisterProvider {
    simple = "simple",
    google = "google",
}

const SimpleRegisterDto = z
    .object({
        provider: z.literal(RegisterProvider.simple),
        referBy: ZodSimpleString.max(100).optional(),
        timeZone: ZodSimpleString,
        fcmToken: ZodSimpleString.optional(),
        user: CreateUserDto,
    })
    .strict()
const GoogleRegisterDto = z
    .object({
        provider: z.literal(RegisterProvider.google),
        referBy: ZodSimpleString.max(100).optional(),
        timeZone: ZodSimpleString,
        fcmToken: ZodSimpleString.optional(),
        user: CreateUserDto.partial({
            password: true,
        }),
    })
    .strict()

export const RegisterDto = z.discriminatedUnion("provider", [SimpleRegisterDto, GoogleRegisterDto])

export type IRegisterDto = z.infer<typeof RegisterDto>
