
import express from 'express'
import pool from '../db/pool.js'

const router = express.Router()

router.get("/get-total-employees", async (req, res) => {
    try {
        const addedThisMonth = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'employee' AND hire_date >= CURRENT_DATE - 30")
        const totalEmployees = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'employee'")
        return res.status(200).json({
            addedThisMonth: addedThisMonth.rows[0].count,
            totalEmployees: totalEmployees.rows[0].count,
        })
    } catch (err) {
        console.error("get-total-employees: ", err)
        return res.status(500).json({ error: "Failed to fetch employees" })
    }
})

export default router