import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { ErrorCode, StatusCode } from "../../config/constant/code.constant"
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
        const { statusCode } = await supertest(app).post("/v1/auth/register").send({})
        expect(statusCode).toBe(StatusCode.BAD_REQUEST)
    })
    it("given valid user payload", async () => {
        const { statusCode, body } = await supertest(app).post("/v1/auth/register").send(createUserPayload)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response.accessToken).toBeDefined()
        accessToken = body.response.accessToken
    })
    it("given same user payload", async () => {
        const { statusCode, body } = await supertest(app).post("/v1/auth/register").send(createUserPayload)
        expect(body?.errorCode).toBe(ErrorCode.ALREADY_USED)
        expect(statusCode).toBe(StatusCode.BAD_REQUEST)
    })
    it("get registered user", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response).toBeDefined()
        expect(body.response.id).toBeDefined()
    })
})
