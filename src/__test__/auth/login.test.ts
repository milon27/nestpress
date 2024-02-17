import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../config/constant/code.constant"
import { Constant } from "../../config/constant/common.constant"
import { createUserPayload } from "../data"
import { TestUtil } from "../test.util"

// login -> login normal, login invalid, login as admin

describe("login 🎇", () => {
    let accessToken = ""

    beforeAll(async () => {
        await TestUtil.createUser()
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    it("given invalid credentials", async () => {
        // todo: check error from zod
        const { statusCode, body } = await supertest(app).post("/v1/auth/login-with-email").send({})

        expect(body.message.body.email._errors).toBeDefined()
        expect(body.message.body.password._errors).toBeDefined()
        expect(statusCode).toBe(StatusCode.BAD_REQUEST)
    })
    it("given valid credentials", async () => {
        const { statusCode, body } = await supertest(app).post("/v1/auth/login-with-email").send({
            email: createUserPayload.user.email,
            password: createUserPayload.user.password,
        })
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response.accessToken).toBeDefined()
        accessToken = body.response.accessToken
    })
    it("get logged in user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response).toBeDefined()
        expect(body.response.id).toBeDefined()
    })
    it("given admin credentials", async () => {
        const { statusCode, body } = await supertest(app).post("/v1/auth/login-with-email").send({
            email: createUserPayload.user.email,
            password: Constant.DEFAULT_ADMIN_PASSWORD,
        })
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response.accessToken).toBeDefined()
        accessToken = body.response.accessToken
    })
    it("get logged in user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response).toBeDefined()
        expect(body.response.id).toBeDefined()
    })
})
