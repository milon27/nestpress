import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        fileParallelism: false, // don't run multiple file at the same time [singleThread: true, deprecated]
        hookTimeout: 20_000, // in ms
        testTimeout: 10_000, // in ms
        globalSetup: "./src/__test__/test-env.setup.ts",
    },
})
