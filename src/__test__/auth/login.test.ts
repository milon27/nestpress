import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../constant/code.constant"
import { CommonConstant } from "../../constant/common.constant"
import { createUserPayload } from "../data"
import { TestUtil } from "../test.util"

// login -> login normal, login invalid, login as admin

describe("login 🎇", () => {
    let accessToken = ""

    beforeAll(async () => {
        console.log("========= login 🎇 ========")
        accessToken = await TestUtil.createUser(supertest(app))
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    it("given invalid credentials", async () => {
        // todo: check error from zod
        const { statusCode } = await supertest(app).post("/api/auth/sign-in/email").send({})

        expect(statusCode).toBe(StatusCode.BAD_REQUEST)
    })
    it("given valid credentials", async () => {
        const res = await supertest(app).post("/api/auth/sign-in/email").send({
            email: createUserPayload.email,
            password: createUserPayload.password,
        })
        expect(res.statusCode).toBe(StatusCode.OK)
        expect(res.body.token).toBeDefined()

        // Parse cookies from the Set-Cookie header
        const setCookie = res.headers["set-cookie"][0]
        accessToken = TestUtil.parseTokenFromCookie(setCookie) || "invalid token"
    })
    it("get logged in user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.session.userId).toBeDefined()
        expect(body.user.id).toBeDefined()
    })
    it("given admin credentials", async () => {
        const res = await supertest(app).post("/api/auth/sign-in/email").send({
            email: createUserPayload.email,
            password: CommonConstant.DEFAULT_ADMIN_PASSWORD,
        })
        expect(res.statusCode).toBe(StatusCode.OK)
        expect(res.body.token).toBeDefined()
        // Parse cookies from the Set-Cookie header
        const setCookie = res.headers["set-cookie"]
        accessToken = TestUtil.parseTokenFromCookie(setCookie[0]) || "invalid token"
    })
    it("get logged in user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.session.userId).toBeDefined()
        expect(body.user.id).toBeDefined()
    })
})
