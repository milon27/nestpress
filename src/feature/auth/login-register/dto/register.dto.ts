import { z } from "zod"
import { CreateUserDto } from "../../../user/dto/user.dto"

export enum RegisterProvider {
    simple = "simple",
    google = "google",
}

const SimpleRegisterDto = z
    .object({
        provider: z.literal(RegisterProvider.simple),
        user: CreateUserDto,
    })
    .strict()
const GoogleRegisterDto = z
    .object({
        provider: z.literal(RegisterProvider.google),
        user: CreateUserDto.partial({
            password: true,
        }),
    })
    .strict()

export const RegisterDto = z.discriminatedUnion("provider", [SimpleRegisterDto, GoogleRegisterDto])

export type IRegisterDto = z.infer<typeof RegisterDto>
