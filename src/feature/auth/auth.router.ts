import { Router } from "express"
import ForgetPasswordRouter from "./forget-password/forget-password.router"
import LoginRegisterRouter from "./login-register/login-register.router"
import LogoutRouter from "./logout/logout.router"
import TokenRouter from "./token/token.router"
import VerifyEmailRouter from "./verify-email/verify-email.router"

const AuthRouter = Router()

// ! "/" should not be there either replace "/something" or put at the end

// token
AuthRouter.use("/token", TokenRouter)
// logout
AuthRouter.use("/logout", LogoutRouter)
// forget password
AuthRouter.use("/forget-password", ForgetPasswordRouter)
// verify-email
AuthRouter.use("/verify-email", VerifyEmailRouter)
// login-register
AuthRouter.use("/", LoginRegisterRouter)

export default AuthRouter
