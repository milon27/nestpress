import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../constant/code.constant"
import { CommonConstant } from "../../constant/common.constant"
import { createUserPayload } from "../data"
import { TestUtil } from "../test.util"

// login -> login normal, login invalid, login as admin

describe("login 🎇", () => {
    let cookie = ""

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
        const res = await supertest(app).post("/api/auth/sign-in/email").send({
            email: createUserPayload.email,
            password: createUserPayload.password,
        })
        expect(res.statusCode).toBe(StatusCode.OK)
        expect(res.body.token).toBeDefined()
        cookie = res.headers["set-cookie"][0]
    })
    it("get logged in user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), cookie)
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
        cookie = res.headers["set-cookie"][0]
    })
    it("get logged in user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), cookie)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.session.userId).toBeDefined()
        expect(body.user.id).toBeDefined()
    })
})
