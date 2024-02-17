import { sql } from "drizzle-orm"
import { boolean, datetime, mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { Constant } from "../../../constant/common.constant"

export const GenderEnum = ["male", "female"] as const
export type IGenderEnum = (typeof GenderEnum)[number]

export const UserSchema = mysqlTable("user_table", {
    id: varchar("id", { length: 50 }).primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    gender: mysqlEnum("gender", GenderEnum).default("male").notNull(),
    avatar: varchar("avatar", { length: 255 }),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    isSuperAdmin: boolean("is_super_admin").default(false).notNull(),

    // address
    countryCode: varchar("country_code", { length: 5 }).default("BD").notNull(),
    city: varchar("city", { length: 50 }),
    state: varchar("state", { length: 50 }),
    zipCode: varchar("zip_code", { length: 50 }),
    address: varchar("address", { length: 255 }),
    // extra info
    timeZone: varchar("time_zone", { length: 50 }).notNull().default(Constant.TIMEZONE),
    fcmToken: varchar("fcm_token", { length: 255 }),
    lastLoggedIn: datetime("last_logged_in")
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    createdAt: datetime("created_at")
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
})

export type IUser = typeof UserSchema.$inferSelect
export type IUserNoPassword = Omit<IUser, "password">
export type ICreateUser = typeof UserSchema.$inferInsert
