import supertest from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../constant/code.constant"
import { createUserPayload } from "../data"
import { TestUtil } from "../test.util"

// login -> login normal, login invalid, login as admin

describe("logout 📤", () => {
    let cookie = ""

    beforeAll(async () => {
        await TestUtil.createUser()
        const res = await supertest(app).post("/api/auth/sign-in/email").send({
            email: createUserPayload.email,
            password: createUserPayload.password,
        })
        expect(res.statusCode).toBe(StatusCode.OK)
        expect(res.body.token).toBeDefined()
        cookie = res.headers["set-cookie"][0]
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    it("logged in user logout", async () => {
        const { statusCode, body } = await supertest(app).post("/api/auth/sign-out").set("Cookie", `${cookie}`)
        cookie = ""
        expect(statusCode).toBe(StatusCode.OK)
        expect(body.success).toBe(true)
    })

    it("try to logout again", async () => {
        const { statusCode } = await supertest(app).post("/v1/auth/logout").set("Cookie", `${cookie}`)
        expect(statusCode).toBe(StatusCode.NOT_FOUND)
    })

    it("without login try to access profile", async () => {
        const { body } = await TestUtil.getLoggedInUser(supertest(app), cookie)
        expect(body).toBe(null)
    })
})
