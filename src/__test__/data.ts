import { Constant } from "../config/constant/common.constant"
import { ILoginWithEmailDto } from "../feature/auth/login-register/dto/login.dto"
import { IRegisterDto, RegisterProvider } from "../feature/auth/login-register/dto/register.dto"

// auth
export const loginUserPayload: ILoginWithEmailDto = {
    email: "test@g.com",
    password: "1234567",
}
export const createUserPayload: IRegisterDto = {
    provider: RegisterProvider.simple,
    user: {
        ...loginUserPayload,
        fullName: "test",
        timeZone: Constant.TIMEZONE,
    },
}
