import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'

import userRoutes from './routes/users'
import invoicesRoutes from './routes/invoices'
import authRoutes from './routes/auth'
import connectDB from './db'
import { errorHandler } from './middleware'
const PORT = process.env.PORT || 3000
const app = express()
connectDB()

const allowedOrigins = ['https://invoices-ga5s.onrender.com', 'http://localhost:3000']

const corsOptions = {
    origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}

app.use(cors(corsOptions))
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(errorHandler)

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/invoices', invoicesRoutes)

app.all('*', (req, res, next) => {
    res.status(404).json({ message: 'Page not found' })
})

app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT} !`))