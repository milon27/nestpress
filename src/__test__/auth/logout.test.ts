import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../config/constant/code.constant"
import { KeyConstant } from "../../config/constant/key.constant"
import { TestUtil } from "../test.util"

// login -> login normal, login invalid, login as admin

describe("logout 📤", () => {
    let accessToken = ""

    beforeAll(async () => {
        const token = await TestUtil.createUser()
        accessToken = token.accessToken
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    it("logged in user logout", async () => {
        const { statusCode } = await supertest(app)
            .post("/v1/auth/logout")
            .set("Cookie", `${KeyConstant.ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        accessToken = ""
        expect(statusCode).toBe(StatusCode.OK)
    })

    it("try to logout again", async () => {
        const { statusCode } = await supertest(app)
            .post("/v1/auth/logout")
            .set("Cookie", `${KeyConstant.ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        expect(statusCode).toBe(StatusCode.UNAUTHORIZED)
    })

    it("without login try to access profile", async () => {
        const { statusCode } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.UNAUTHORIZED)
    })
})
