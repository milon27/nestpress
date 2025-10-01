import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import "./config/env.config"
// import "./config/firebase.config"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./config/auth/auth"
import v1RouterConfig from "./config/router/v1-router.config"
import { globalErrorMid, notFoundMid } from "./middleware/error.mid"
import { globalRateLimiter } from "./middleware/limiter/global-rete.limiter"
import { loggerMid } from "./middleware/logger.mid"

// init
const app = express()

// middleware

app.all("/api/auth/{*any}", toNodeHandler(auth))
app.use(helmet())
app.use(globalRateLimiter)
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors({ origin: true, credentials: true }))
app.use([loggerMid])

// routers
app.use("/v1", v1RouterConfig)

// global error handle
app.use(notFoundMid)
app.use(globalErrorMid)

export default app
