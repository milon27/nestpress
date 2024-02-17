import supertest from "supertest"
import { describe, expect, it } from "vitest"
import app from "../app"

describe("health-check", () => {
    describe("check root route", () => {
        it("should return text with env values", async () => {
            const result = await supertest(app).get("/v1/health")
            expect(result.text).contain("Running app in test , https:false, TZ:Etc/UTC")
        })
    })
    describe("check database connection", () => {
        it("should return response", async () => {
            const result = await supertest(app).get("/v1/health/db")
            expect(result.body.response).toBeDefined()
        })
    })
    describe("check redis connection", () => {
        it("should return response", async () => {
            const result = await supertest(app).get("/v1/health/redis")
            expect(result.body.response).toBeDefined()
        })
    })
})
