import { Router } from "express"
import { AuthMid } from "../../../middleware/auth.mid"
import { validateMid } from "../../../middleware/validate.mid"
import { LogoutDto } from "./dto/logout.dto"
import { LogoutController } from "./logout.controller"

const LogoutRouter = Router()

/**
 * @description logout user
 * @note only logged in user can logout
 * @url {{BASE_URL}}/auth/logout
 */
LogoutRouter.post("/", AuthMid.isLoggedInMid, validateMid({ body: LogoutDto }), LogoutController.logoutUser)

export default LogoutRouter
