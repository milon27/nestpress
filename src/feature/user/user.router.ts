import { Router } from "express"
import { IdParamDto } from "../../common/dto/params.dto"
import { AuthMid } from "../../middleware/auth.mid"
import { validateMid } from "../../middleware/validate.mid"
import { UpdateUserDto } from "./dto/user.dto"
import { UserController } from "./user.controller"

const UserRouter = Router()

UserRouter.use(AuthMid.isLoggedInMid)

/**
 * @description get logged in user
 * @url {{BASE_URL}}/v1/user
 */
UserRouter.post("/", UserController.getLoggedInUser)

/**
 * @description update a user (super admin can update anyone, other can update his own info)
 * @url {{BASE_URL}}/v1/user/:id
 */
UserRouter.put(
    "/:id",
    validateMid({
        params: IdParamDto,
        body: UpdateUserDto,
    }),
    UserController.updateUser
)

/**
 * @description delete a user (remove user is different::MonthMemRouter)
 * @url {{BASE_URL}}/v1/user/:id
 */
UserRouter.delete("/:id", AuthMid.isSuperAdmin, UserController.deleteUser)

export default UserRouter
