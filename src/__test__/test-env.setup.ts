import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql"
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis"
import { exec } from "node:child_process"
import { myLogger } from "../config/logger"

export class TestEnvironment {
    private mySQLContainer!: StartedMySqlContainer

    private redisContainer!: StartedRedisContainer

    async start() {
        this.mySQLContainer = await new MySqlContainer("mysql:8.0.33").start()
        this.redisContainer = await new RedisContainer("redis:7.4.1-alpine").start()

        // Update process.env with dynamic ports
        process.env.DATABASE_URL = `mysql://${this.mySQLContainer.getUsername()}:${this.mySQLContainer.getUserPassword()}@${this.mySQLContainer.getHost()}:${this.mySQLContainer.getPort()}/${this.mySQLContainer.getDatabase()}`
        process.env.REDIS_URL = `${this.redisContainer.getConnectionUrl()}`
        myLogger().info(`DB=${process.env.DATABASE_URL}`)
        myLogger().info(`REDIS=${process.env.REDIS_URL}`)
    }

    async stop() {
        await this.mySQLContainer.stop()
        await this.redisContainer.stop()
    }
}

function runCommand(command: string) {
    return new Promise((resolve, reject) => {
        exec(command, { env: process.env }, (error, stdout) => {
            if (error) reject(error)
            else resolve(stdout)
        })
    })
}

// setup test env
const testEnv = new TestEnvironment()

export async function setup() {
    myLogger().info("we are setting up")
    await testEnv.start()
    // run db migration
    myLogger().info("we are db migrating")
    await runCommand("npm run db:migrate")
    // seed db
    myLogger().info("we are db seeding")
    await runCommand("npm run db:seed")
}

export async function teardown() {
    myLogger().info("we are cleaning up")
    // cleanup
    await testEnv.stop()
    myLogger().info("cleaning up done")
    // Force exit after cleanup to prevent hanging
    setTimeout(() => {
        process.exit(0)
    }, 2000)
}
