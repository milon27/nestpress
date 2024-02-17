import { NextFunction, Request, Response } from "express"
import { ForbiddenError, UnAuthorizedError } from "../../common/model/error.model"
import { StatusCode } from "../../config/constant/code.constant"
import { MyResponse } from "../../utils/my-response.util"
import { IUpdateUserDto } from "./dto/user.dto"
import { UserService } from "./user.service"

export const UserController = {
    getLoggedInUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await UserService.getUserByIdentifier("id", req.user.id)
            if (!user) {
                throw new UnAuthorizedError()
            }
            return res.status(StatusCode.OK).send(MyResponse("user information", user))
        } catch (error) {
            return next(error)
        }
    },
    updateUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // check if req.user is super admin or not
            const userId = req.params.id
            if (userId !== req.user.id) {
                // trying to update someone else info, check if he is super-admin
                if (req.user.isSuperAdmin === false) {
                    throw new ForbiddenError("you don't have permission")
                }
            }
            const {
                fullName,
                email,
                phone,
                password,
                gender,
                fcmToken,
                avatar,
                countryCode,
                city,
                state,
                zipCode,
                address,
                lastLoggedIn,
                timeZone,
            } = req.body as IUpdateUserDto
            // call the update api
            await UserService.updateUser(userId, {
                fullName,
                email,
                phone,
                password,
                gender,
                fcmToken,
                avatar,
                countryCode,
                city,
                state,
                zipCode,
                address,
                lastLoggedIn: lastLoggedIn ? new Date(lastLoggedIn) : undefined,
                timeZone,
            })
            return res.status(StatusCode.OK).send(MyResponse(`user updated`))
        } catch (error) {
            return next(error)
        }
    },
    deleteUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await UserService.deleteUser("id", req.params.id)
            // todo: check anything else need to be deleted or not?
            return res.status(StatusCode.OK).send(MyResponse(`user deleted with id: ${req.params.id}`))
        } catch (error) {
            return next(error)
        }
    },
}
