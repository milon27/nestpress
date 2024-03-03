import bcryptjs from "bcryptjs"
import { eq, sql } from "drizzle-orm"
import { ICurrentUser } from "../../common/model/current-user.model"
import { IDb, db } from "../../config/db/db"
import { ICreateUser, IUser, IUserNoPassword, UserSchema } from "../../config/db/schema/user/user.schema"
import { UniqueId } from "../../utils/common.util"
import { ICreateUserDto } from "./dto/user.dto"

export const UserService = {
    getUserByIdentifier: async (
        by: "id" | "email",
        identifier: string,
        withPassword = false,
        dbOrTx?: IDb
    ): Promise<IUser | IUserNoPassword | undefined> => {
        const myDb = dbOrTx || db
        const where =
            by === "id" ? eq(UserSchema.id, sql.placeholder("id")) : eq(UserSchema.email, sql.placeholder("email"))
        const fullUserPrep = myDb.query.UserSchema.findFirst({
            where,
        }).prepare()

        const fullUser: IUser | undefined = await fullUserPrep.execute(
            by === "id"
                ? {
                      id: identifier,
                  }
                : {
                      email: identifier,
                  }
        )

        if (fullUser) {
            if (withPassword) {
                return fullUser
            }
            const { password, ...user } = fullUser
            return user
        }
        return undefined
    },
    getUserAndPermissions: async (by: "id" | "email", identifier: string, dbOrTx?: IDb) => {
        const myDb = dbOrTx || db
        const where = by === "id" ? eq(UserSchema.id, identifier) : eq(UserSchema.email, identifier)

        const user = await myDb.query.UserSchema.findFirst({
            where,
            columns: {
                id: true,
                password: true,
                isSuperAdmin: true,
                timeZone: true,
            },
        })

        return user
    },
    registerAndGetUser: async (
        body: ICreateUserDto,
        isEmailVerified = false
    ): Promise<ICurrentUser | undefined> => {
        // create the new user.
        const user = await db.transaction(async (tx) => {
            await UserService.createUser(
                {
                    ...body,
                    isEmailVerified,
                },
                tx
            )
            const data = await UserService.getUserAndPermissions("email", body.email, tx)
            return data
        })
        if (user) {
            return UserService.convertUserToCurrentUser(user)
        }
        return undefined
    },
    createUser: async (body: Omit<ICreateUser, "id">, dbOrTx?: IDb) => {
        const myDb = dbOrTx || db

        // get hash pass & save new user into db
        const uid = UniqueId.createUlid()
        const hashPass = await bcryptjs.hash(body.password, await bcryptjs.genSalt(10))

        await myDb.insert(UserSchema).values({
            ...body, // few props will replace by specific ones below
            id: uid,
            password: hashPass,
            fcmToken: body.fcmToken ? body.fcmToken : body.fcmToken === null ? null : undefined,
        })
        return uid
    },
    updateUser: async (id: string, body: Partial<ICreateUser>): Promise<IUserNoPassword> => {
        // clear the cache for logged user data-> in controller label
        // get hash pass & save new user into db
        const hashPass = body.password ? await bcryptjs.hash(body.password, await bcryptjs.genSalt(10)) : undefined
        // update the user
        await db
            .update(UserSchema)
            .set({
                ...body,
                password: hashPass,
                fcmToken: body.fcmToken ? body.fcmToken : body.fcmToken === null ? null : undefined,
            })
            .where(eq(UserSchema.id, id))
        const user = (await UserService.getUserByIdentifier("id", id)) as IUserNoPassword
        return user
    },
    deleteUser: async (by: "id" | "email", identifier: string) => {
        const where = by === "id" ? eq(UserSchema.id, identifier) : eq(UserSchema.email, identifier)
        await db.delete(UserSchema).where(where)
    },
    convertUserToCurrentUser: (user: {
        id: string
        password: string
        isSuperAdmin: boolean
        timeZone: string
    }) => {
        return {
            id: user.id,
            isSuperAdmin: user.isSuperAdmin || false,
            timeZone: user.timeZone,
        } satisfies ICurrentUser
    },
}
