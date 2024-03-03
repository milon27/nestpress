import { z } from "zod"
import { GenderEnum } from "../../../config/db/schema/user/user.schema"
import {
    ZodDateString,
    ZodEmailString,
    ZodMin1UpdateRefine,
    ZodNameString,
    ZodPasswordString,
    ZodSimpleString,
} from "../../../utils/zod.util"

export const CreateUserDto = z.object({
    fullName: ZodNameString.min(2).max(200),
    email: ZodEmailString,
    password: ZodPasswordString,
    gender: z.enum(GenderEnum).default("male").optional(),
    timeZone: ZodSimpleString,
    fcmToken: ZodSimpleString.max(255).nullish(),
})

export type ICreateUserDto = z.infer<typeof CreateUserDto>

export const UpdateUserDto = CreateUserDto.extend({
    avatar: ZodSimpleString.nullish(),
    phone: ZodSimpleString,
    countryCode: ZodSimpleString,
    city: ZodSimpleString,
    state: ZodSimpleString,
    zipCode: ZodSimpleString,
    address: ZodSimpleString,
    lastLoggedIn: ZodDateString,
})
    .partial()
    .refine(ZodMin1UpdateRefine, {
        message: "update least 1 property",
    })

export type IUpdateUserDto = z.infer<typeof UpdateUserDto>
