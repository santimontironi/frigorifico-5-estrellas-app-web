import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {router as authRouter} from './routes/auth.routes.js'
import {router as userRouter} from './routes/user.routes.js'
import {router as adminRouter} from './routes/admin.routes.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()

app.use(express.json()) // para poder usar req.body

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser()) // para poder usar req.cookies

app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', adminRouter)

export default app