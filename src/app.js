import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use((req, res, next) => {
    console.log("Received ${req.method} request with body:", req.body);
    console.log("Received ${req.method} request with params:", req.params);
    next();
})


import userRouter from "./routes/user.routes.js"
import languageRouter from "./routes/language.routes.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/language", languageRouter)

export {app}