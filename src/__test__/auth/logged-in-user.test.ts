import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../config/constant/code.constant"
import { TestUtil } from "../test.util"

describe("logged in user 👤", () => {
    let accessToken = ""

    beforeAll(async () => {
        const token = await TestUtil.createUser()
        accessToken = token.accessToken
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    it("with cookie", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response).toBeDefined()
        expect(body.response.id).toBeDefined()
    })

    it("with auth header", async () => {
        const { statusCode, body } = await supertest(app)
            .post("/v1/user")
            .set({ Authorization: `Bearer ${accessToken}` })

        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response).toBeDefined()
        expect(body.response.id).toBeDefined()
    })

    it("with random invalid token", async () => {
        const { statusCode } = await TestUtil.getLoggedInUser(supertest(app), "random token")
        expect(statusCode).toBe(StatusCode.UNAUTHORIZED)
    })

    it("without any token", async () => {
        const { statusCode } = await supertest(app).post("/v1/user")
        expect(statusCode).toBe(StatusCode.UNAUTHORIZED)
    })
})
