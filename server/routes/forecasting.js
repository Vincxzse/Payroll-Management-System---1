import express from 'express'
import pool from '../db/pool.js'
const router = express.Router()

// Get historical payroll data for ML training
router.get("/payroll-historical", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                EXTRACT(MONTH FROM pp.end_date) as month,
                EXTRACT(YEAR FROM pp.end_date) as year,
                TO_CHAR(pp.end_date, 'Mon') as month_name,
                SUM(pr.gross_pay) as total_gross,
                SUM(pr.net_pay) as total_net,
                COUNT(DISTINCT pr.user_id) as employee_count,
                AVG(pr.net_pay) as avg_pay
            FROM payroll_periods pp
            JOIN payroll_records pr ON pp.period_id = pr.period_id
            WHERE pp.end_date >= CURRENT_DATE - INTERVAL '24 months'
            GROUP BY EXTRACT(MONTH FROM pp.end_date), EXTRACT(YEAR FROM pp.end_date), TO_CHAR(pp.end_date, 'Mon')
            ORDER BY year, month
        `)
        
        return res.json({ historical: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get historical performance data for ML training
router.get("/performance-historical", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                month,
                year,
                TO_CHAR(TO_DATE(month::text, 'MM'), 'Mon') as month_name,
                AVG(score) as avg_score,
                COUNT(DISTINCT user_id) as employee_count
            FROM kpi_scores
            WHERE created_at >= CURRENT_DATE - INTERVAL '24 months'
            GROUP BY month, year
            ORDER BY year, month
        `)
        
        return res.json({ historical: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get department-specific forecast data
router.get("/department-forecast/:departmentId", async (req, res) => {
    try {
        const { departmentId } = req.params
        
        const result = await pool.query(`
            SELECT 
                EXTRACT(MONTH FROM pp.end_date) as month,
                EXTRACT(YEAR FROM pp.end_date) as year,
                SUM(pr.net_pay) as total_pay,
                COUNT(DISTINCT pr.user_id) as employee_count
            FROM payroll_records pr
            JOIN payroll_periods pp ON pr.period_id = pp.period_id
            JOIN users u ON pr.user_id = u.user_id
            WHERE u.department_id = $1
            AND pp.end_date >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY EXTRACT(MONTH FROM pp.end_date), EXTRACT(YEAR FROM pp.end_date)
            ORDER BY year, month
        `, [departmentId])
        
        return res.json({ departmentData: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get ML model metadata
router.get("/model-info", async (req, res) => {
    try {
        // Get data quality metrics
        const recordCount = await pool.query(`
            SELECT COUNT(*) as count FROM payroll_records
        `)
        
        const dateRange = await pool.query(`
            SELECT 
                MIN(end_date) as min_date,
                MAX(end_date) as max_date
            FROM payroll_periods
        `)
        
        return res.json({
            modelInfo: {
                dataPoints: parseInt(recordCount.rows[0].count),
                dateRange: dateRange.rows[0],
                modelType: 'ARIMA',
                confidence: 87,
                lastUpdated: new Date().toISOString()
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

export default router