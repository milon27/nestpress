import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../constant/code.constant"
import { createUserPayload } from "../data"
import { TestUtil } from "../test.util"

describe("logged in user 👤", () => {
    let cookie = ""

    beforeAll(async () => {
        await TestUtil.createUser()
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })
    it("login", async () => {
        const res = await supertest(app).post("/api/auth/sign-in/email").send({
            email: createUserPayload.email,
            password: createUserPayload.password,
        })
        expect(res.statusCode).toBe(StatusCode.OK)
        expect(res.body.token).toBeDefined()
        cookie = res.headers["set-cookie"][0]
    })

    it("with cookie", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), cookie)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.session.userId).toBeDefined()
        expect(body.user.id).toBeDefined()
    })

    // it("with auth header", async () => {
    //     const { statusCode, body } = await supertest(app)
    //         .post("/v1/user")
    //         .set({ Authorization: `Bearer ${accessToken}` })

    //     expect(statusCode).toBe(StatusCode.OK)
    //     expect(body.response).toBeDefined()
    //     expect(body.response.id).toBeDefined()
    // })

    it("with random invalid token", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), "random token")
        expect(body).toBe(null)
    })
})
