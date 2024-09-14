import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import { connectDB } from './db/connect.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'
import postRouter from './routes/postRoutes.js'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory
// console.log(path.join(__dirname, '../client', 'dist', 'index.html'))
app.use(express.static(path.join(__dirname, '../client/dist')))

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

app.use(express.json())
app.use(fileUpload({ useTempFiles: true }))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/notification', notificationRouter)
app.use('/api/v1/posts', postRouter)

app.get('*', (req, res) => {
  res.sendFile(
    // path.join(__dirname, '../client', 'index.html')
    path.join(__dirname, '../client', 'dist', 'index.html')
  )
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  connectDB()
  console.log(`Server Running on port ${PORT}...`)
})
