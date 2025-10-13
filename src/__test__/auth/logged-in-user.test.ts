import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../constant/code.constant"
import { TestUtil } from "../test.util"

describe("logged in user 👤", () => {
    let accessToken = ""

    beforeAll(async () => {
        console.log("========= logged in user 👤 ========")
        accessToken = await TestUtil.createUser(supertest(app))
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    it("should get session and user with valid token", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), accessToken)
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.session.userId).toBeDefined()
        expect(body.user.id).toBeDefined()
    })

    it("should get null and status code 200 with invalid token", async () => {
        const { statusCode, body } = await TestUtil.getLoggedInUser(supertest(app), "random token")
        expect(statusCode).toBe(StatusCode.OK)
        expect(body).toBe(null)
    })
})
