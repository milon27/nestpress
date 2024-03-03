import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        hookTimeout: 20000,
        testTimeout: 10000,
        fileParallelism: false,
    },
})
