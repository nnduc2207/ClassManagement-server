"use strict"
const express = require("express")
const httpErrors = require("http-errors")
const path = require("path")
const ejs = require("ejs")
const pino = require("pino")
const pinoHttp = require("pino-http")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")

if (process.env.NODE_ENV === "development") {
  require("dotenv").config()
}
// Set default options
const ready = function () {}

const logger = pino()

// database setup
const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost/hcmusclassmanager"
const mongooseConfigs = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.connect(mongoUri, mongooseConfigs)

// Server state
let server
let serverStarted = false
let serverClosing = false

// Setup error handling
function unhandledError(err) {
    // Log the errors
    logger.error(err)

    // Only clean up once
    if (serverClosing) {
        return
    }
    serverClosing = true

    // If server has started, close it down
    if (serverStarted) {
        server.close(function () {
            process.exit(1)
        })
    }
}
process.on("uncaughtException", unhandledError)
process.on("unhandledRejection", unhandledError)

// Create the express app
const app = express()

// Template engine
app.engine("html", ejs.renderFile)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "html")

// Common middleware
// app.use(/* ... */)
app.use(cors())
app.use(pinoHttp({ logger }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Register routes
// @NOTE: require here because this ensures that even syntax errors
// or other startup related errors are caught logged and debuggable.
// Alternativly, you could setup external log handling for startup
// errors and handle them outside the node process.  I find this is
// better because it works out of the box even in local development.
require("./routes")(app)

// Common error handlers
app.use(function fourOhFourHandler(req, res, next) {
    next(httpErrors(404, `Route not found: ${req.url}`))
})
app.use(function fiveHundredHandler(err, req, res, next) {
    if (err.status >= 500) {
        logger.error(err)
    }
    res.locals.name = "."
    res.locals.error = err
    res.status(err.status || 500).render("error")
})

// Start server
server = app.listen(process.env.PORT || 3001, function (err) {
    if (err) {
        return ready(err, app, server)
    }

    // If some other error means we should close
    if (serverClosing) {
        return ready(new Error("Server was closed before it could start"))
    }

    serverStarted = true
    const addr = server.address()
    logger.info(
        `Started at ${addr.host || "localhost"}:${addr.port}`
    )
    ready(err, app, server)
})
