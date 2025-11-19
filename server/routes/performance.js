import express from 'express'
import pool from '../db/pool.js'
const router = express.Router()

// Get KPI trends (monthly averages)
router.get("/kpi-trends", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                month,
                year,
                TO_CHAR(TO_DATE(month::text, 'MM'), 'Mon') as month_name,
                AVG(score) as avg_score,
                COUNT(*) as total_scores
            FROM kpi_scores
            WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY month, year
            ORDER BY year, month
        `)
        
        return res.json({ trends: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get department performance summary
router.get("/department-summary", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                d.department_id,
                d.name,
                d.code,
                AVG(ks.score) as avg_score,
                COUNT(DISTINCT u.user_id) as employee_count
            FROM departments d
            LEFT JOIN users u ON d.department_id = u.department_id
            LEFT JOIN kpi_scores ks ON u.user_id = ks.user_id
            WHERE u.status = 'active'
            GROUP BY d.department_id, d.name, d.code
            HAVING AVG(ks.score) IS NOT NULL
            ORDER BY avg_score DESC
        `)
        
        return res.json({ departments: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get top employee performance
router.get("/top-employees", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.first_name,
                u.last_name,
                u.position,
                AVG(ks.score) as avg_score
            FROM users u
            INNER JOIN kpi_scores ks ON u.user_id = ks.user_id
            WHERE u.status = 'active'
            GROUP BY u.user_id, u.first_name, u.last_name, u.position
            HAVING AVG(ks.score) IS NOT NULL
            ORDER BY avg_score DESC
            LIMIT 10
        `)
        
        return res.json({ employees: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get overall statistics
router.get("/overall-stats", async (req, res) => {
    try {
        const avgResult = await pool.query(`
            SELECT AVG(score) as current_avg
            FROM kpi_scores
            WHERE month = EXTRACT(MONTH FROM CURRENT_DATE)
            AND year = EXTRACT(YEAR FROM CURRENT_DATE)
        `)
        
        const prevAvgResult = await pool.query(`
            SELECT AVG(score) as prev_avg
            FROM kpi_scores
            WHERE month = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
            AND year = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')
        `)
        
        const activeResult = await pool.query(`
            SELECT COUNT(*) as count
            FROM users
            WHERE status = 'active'
        `)
        
        const topPerformersResult = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as count
            FROM kpi_scores
            WHERE score >= 90
            AND month = EXTRACT(MONTH FROM CURRENT_DATE)
            AND year = EXTRACT(YEAR FROM CURRENT_DATE)
        `)
        
        const currentAvg = parseFloat(avgResult.rows[0]?.current_avg) || 0
        const prevAvg = parseFloat(prevAvgResult.rows[0]?.prev_avg) || 0
        const change = prevAvg > 0 ? ((currentAvg - prevAvg) / prevAvg) * 100 : 0
        
        return res.json({
            stats: {
                average: currentAvg,
                change: change,
                activeEmployees: parseInt(activeResult.rows[0].count),
                topPerformers: parseInt(topPerformersResult.rows[0].count)
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

export default router