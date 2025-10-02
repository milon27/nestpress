import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../constant/code.constant"
import { createUserPayload } from "../data"
import { TestUtil } from "../test.util"

describe("signup 🚀", () => {
    let accessToken = ""

    beforeAll(async () => {
        // nothing need to do
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    it("given invalid user payload", async () => {
        const { statusCode } = await supertest(app).post("/api/auth/sign-up/email").send({})
        console.log("statusCode", statusCode)

        expect(statusCode).toBe(StatusCode.BAD_REQUEST)
    })
    it("given valid user payload", async () => {
        const { statusCode, body } = await supertest(app).post("/api/auth/sign-up/email").send(createUserPayload)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.token).toBeDefined()
        accessToken = body.token
    })
    it("given same user payload", async () => {
        const { statusCode, body } = await supertest(app).post("/api/auth/sign-up/email").send(createUserPayload)
        expect(statusCode).toBe(StatusCode.UNPROCESSABLE_ENTITY)
    })
    it("get registered user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body).toBeDefined()
    })
})
