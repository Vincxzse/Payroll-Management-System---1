import express from 'express'
import pool from '../db/pool.js'
const router = express.Router()

// Get payroll reports with filters
router.get("/payroll-reports", async (req, res) => {
    try {
        const { startDate, endDate, department, status } = req.query
        
        let query = `
            SELECT 
                pp.period_id,
                pp.period_name,
                pp.start_date,
                pp.end_date,
                pp.pay_date,
                d.name as department_name,
                d.code as department_code,
                COUNT(DISTINCT pr.user_id) as employee_count,
                SUM(pr.gross_pay) as total_amount,
                pp.status,
                STRING_AGG(DISTINCT pr.status, ', ') as payroll_statuses
            FROM payroll_periods pp
            LEFT JOIN payroll_records pr ON pp.period_id = pr.period_id
            LEFT JOIN users u ON pr.user_id = u.user_id
            LEFT JOIN departments d ON u.department_id = d.department_id
            WHERE 1=1
        `
        
        const params = []
        let paramCount = 1
        
        if (startDate) {
            query += ` AND pp.start_date >= $${paramCount}`
            params.push(startDate)
            paramCount++
        }
        
        if (endDate) {
            query += ` AND pp.end_date <= $${paramCount}`
            params.push(endDate)
            paramCount++
        }
        
        if (department && department !== 'all') {
            query += ` AND d.department_id = $${paramCount}`
            params.push(department)
            paramCount++
        }
        
        if (status && status !== 'all') {
            query += ` AND pp.status = $${paramCount}`
            params.push(status)
            paramCount++
        }
        
        query += `
            GROUP BY pp.period_id, pp.period_name, pp.start_date, pp.end_date, 
                     pp.pay_date, d.name, d.code, pp.status
            ORDER BY pp.end_date DESC
        `
        
        const result = await pool.query(query, params)
        
        return res.json({ reports: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get detailed payroll report for a specific period
router.get("/payroll-detail/:periodId", async (req, res) => {
    try {
        const { periodId } = req.params
        
        const result = await pool.query(`
            SELECT 
                pp.period_name,
                pp.pay_date,
                d.name as department,
                d.code as department_code,
                u.first_name,
                u.last_name,
                u.employee_id,
                pr.basic_salary,
                pr.overtime_amount,
                pr.bonuses,
                pr.deductions,
                pr.gross_pay,
                pr.net_pay,
                pr.status,
                pr.created_at
            FROM payroll_records pr
            JOIN users u ON pr.user_id = u.user_id
            JOIN payroll_periods pp ON pr.period_id = pp.period_id
            LEFT JOIN departments d ON u.department_id = d.department_id
            WHERE pr.period_id = $1
            ORDER BY d.name, u.last_name, u.first_name
        `, [periodId])
        
        return res.json({ details: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get monthly payroll trend data
router.get("/payroll-trend", async (req, res) => {
    try {
        const { year } = req.query
        const targetYear = year || new Date().getFullYear()
        
        const result = await pool.query(`
            SELECT 
                EXTRACT(MONTH FROM pp.end_date) as month,
                TO_CHAR(pp.end_date, 'Mon') as month_name,
                SUM(pr.gross_pay) as total_gross,
                SUM(pr.net_pay) as total_net,
                COUNT(DISTINCT pr.user_id) as employee_count
            FROM payroll_periods pp
            JOIN payroll_records pr ON pp.period_id = pr.period_id
            WHERE EXTRACT(YEAR FROM pp.end_date) = $1
            GROUP BY EXTRACT(MONTH FROM pp.end_date), TO_CHAR(pp.end_date, 'Mon')
            ORDER BY EXTRACT(MONTH FROM pp.end_date)
        `, [targetYear])
        
        return res.json({ trend: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get department breakdown
router.get("/department-breakdown", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                d.department_id,
                d.name,
                d.code,
                COUNT(u.user_id) as employee_count,
                AVG(u.salary) as avg_salary,
                SUM(u.salary) as total_salary
            FROM departments d
            LEFT JOIN users u ON d.department_id = u.department_id
            WHERE u.status = 'active'
            GROUP BY d.department_id, d.name, d.code
            ORDER BY total_salary DESC
        `)
        
        return res.json({ departments: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get report statistics
router.get("/statistics", async (req, res) => {
    try {
        // Total records
        const recordsResult = await pool.query(`
            SELECT COUNT(*) as count FROM payroll_records
        `)
        
        // Active departments
        const deptsResult = await pool.query(`
            SELECT COUNT(DISTINCT department_id) as count 
            FROM users 
            WHERE status = 'active' AND department_id IS NOT NULL
        `)
        
        // Report types (just count of different periods)
        const typesResult = await pool.query(`
            SELECT COUNT(*) as count FROM payroll_periods
        `)
        
        return res.json({
            statistics: {
                totalRecords: parseInt(recordsResult.rows[0].count),
                departments: parseInt(deptsResult.rows[0].count),
                reportTypes: parseInt(typesResult.rows[0].count)
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

// Get all departments for filter dropdown
router.get("/departments", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT department_id, name, code
            FROM departments
            ORDER BY name
        `)
        
        return res.json({ departments: result.rows })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
})

export default router