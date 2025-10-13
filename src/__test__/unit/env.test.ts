import { describe, expect, test } from "vitest"
import { EnvConfig } from "../../config/env.config"

describe("check test env", () => {
    test("check:db:redis", () => {
        expect(process.env.DATABASE_URL).toBeDefined()
        expect(process.env.REDIS_URL).toBeDefined()
        expect(EnvConfig.DATABASE_URL).toBeDefined()
        expect(EnvConfig.REDIS_URL).toBeDefined()
    })
})
