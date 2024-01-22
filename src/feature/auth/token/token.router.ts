import { Router } from "express"
import { AuthMid } from "../../../middleware/auth.mid"
import { TokenController } from "./token.controller"

const TokenRouter = Router()

TokenRouter.use(AuthMid.isLoggedInMid)

/**
 * @description verify access token
 * @url {{BASE_URL}}/auth/token
 */
TokenRouter.get("/", TokenController.verifyToken)

export default TokenRouter
