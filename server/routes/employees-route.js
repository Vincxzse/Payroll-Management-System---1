
import express from 'express'
import pool from '../db/pool.js'

const router = express.Router()

router.get("/get-employees", async (req, res) => {
    try {
        const getAll = await pool.query("SELECT * FROM users")
        return res.status(200).json({ employees: getAll })
    } catch (err) {
        console.error("get-employees: ", err)
        return res.status(500).json({ error: "Failed to fetch all employees" })
    }
})

export default router