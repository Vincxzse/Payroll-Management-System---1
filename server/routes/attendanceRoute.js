import express from "express"
import pool from "../db/pool.js"

const router = express.Router()

// Get attendance for a user for current month
router.get("/attendance/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        
        const query = `
            SELECT 
                COUNT(*) FILTER (WHERE status = 'present') as present_days,
                COUNT(*) as total_days,
                SUM(total_hours) as total_hours
            FROM attendance
            WHERE user_id = $1
            AND EXTRACT(MONTH FROM date) = $2
            AND EXTRACT(YEAR FROM date) = $3
        `
        
        const result = await pool.query(query, [userId, currentMonth, currentYear])
        
        // Get last month data
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
        const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
        
        const lastMonthQuery = `
            SELECT 
                COUNT(*) FILTER (WHERE status = 'present') as present_days,
                COUNT(*) as total_days
            FROM attendance
            WHERE user_id = $1
            AND EXTRACT(MONTH FROM date) = $2
            AND EXTRACT(YEAR FROM date) = $3
        `
        
        const lastMonthResult = await pool.query(lastMonthQuery, [userId, lastMonth, lastMonthYear])
        
        return res.status(200).json({
            currentMonth: result.rows[0],
            lastMonth: lastMonthResult.rows[0]
        })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ message: "Error fetching attendance" })
    }
})

export default router