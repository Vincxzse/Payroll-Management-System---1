import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use(authRoutes)

app.get("/", (req, res) => {
    console.log("Server is running")
})

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`)
})