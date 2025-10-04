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
        await TestUtil.createUser()
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
        const { statusCode, body } = await supertest(app).post("/api/auth/sign-in/email").send({
            email: createUserPayload.email,
            password: createUserPayload.password,
        })
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.token).toBeDefined()
        accessToken = body.token
    })
    it("get logged in user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body).toBeDefined()
    })
    it("given admin credentials", async () => {
        const { statusCode, body } = await supertest(app).post("/api/auth/sign-in/email").send({
            email: createUserPayload.email,
            password: CommonConstant.DEFAULT_ADMIN_PASSWORD,
        })
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.token).toBeDefined()
        accessToken = body.token
    })
    it("get logged in user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body).toBeDefined()
    })
})
