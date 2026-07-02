import express from 'express'
import cors from 'cors'
import {router as authRouter} from './routes/auth.routes.js'
import {router as userRouter} from './routes/user.routes.js'
import {router as productRouter} from './routes/product.routes.js'
import {router as contactRouter} from './routes/contact.routes.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json()) // para poder usar req.body

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser()) // para poder usar req.cookies

app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', productRouter)
app.use('/api', contactRouter)

export default app