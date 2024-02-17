import { z } from "zod"

export const LogoutDto = z
    .object({
        isWeb: z.boolean().optional(),
    })
    .strict()

export type ILogoutDto = z.infer<typeof LogoutDto>
