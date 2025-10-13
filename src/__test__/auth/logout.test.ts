import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../constant/code.constant"
import { TestUtil } from "../test.util"

// login -> login normal, login invalid, login as admin

describe("logout 📤", () => {
    let accessToken = ""

    beforeAll(async () => {
        console.log("========= logout 📤 ========")
        accessToken = await TestUtil.createUser(supertest(app))
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    it("logged in user logout", async () => {
        const { statusCode, body } = await TestUtil.setTokenInRequest(
            supertest(app).post("/api/auth/sign-out"),
            accessToken
        )
        accessToken = ""
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.success).toBe(true)
    })

    it("try to logout again", async () => {
        const { statusCode } = await TestUtil.setTokenInRequest(
            supertest(app).post("/api/auth/sign-out"),
            accessToken
        )
        expect(statusCode).toBe(StatusCode.BAD_REQUEST)
    })

    it("without login try to access profile", async () => {
        const { body, statusCode } = await TestUtil.getLoggedInUser(supertest(app), "random token")
        expect(statusCode).toBe(StatusCode.OK)
        expect(body).toBe(null)
    })
})
