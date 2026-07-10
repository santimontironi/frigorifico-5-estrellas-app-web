import express from 'express'
import cors from 'cors'
import { router as authRouter } from './routes/auth.routes.js'
import { router as adminRouter } from './routes/admin.routes.js'
import { router as userRouter } from './routes/user.routes.js'
import { router as productRouter } from './routes/product.routes.js'
import { router as contactRouter } from './routes/contact.routes.js'
import { router as categoryRouter } from './routes/category.routes.js'
import { router as offerRouter } from './routes/offer.routes.js'
import cookieParser from 'cookie-parser'
import { apiLimiter } from './middlewares/rateLimiters.js'

const app = express()

app.set('trust proxy', 1) // confiar en el proxy (Render/Railway/etc) para leer bien la IP del cliente

app.use(express.json()) // para poder usar req.body

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser()) // para poder usar req.cookies

app.use('/api', apiLimiter) // rate limit general para toda la API

app.use('/api', authRouter)
app.use('/api', adminRouter)
app.use('/api', userRouter)
app.use('/api', productRouter)
app.use('/api', categoryRouter)
app.use('/api', contactRouter)
app.use('/api', offerRouter)
export default app