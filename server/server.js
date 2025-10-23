import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import pool from './db/pool.js'

const app = express()
const port = process.env.SERVER_PORT

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    console.log("Server is running")
})

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`)
})