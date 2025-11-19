
import express from "express"
import pool from "../db/pool.js"

const router = express.Router()

// Get payroll periods
router.get("/payroll/periods", async (req, res) => {
    try {
        const query = `
            SELECT 
                period_id,
                period_name,
                start_date,
                end_date,
                pay_date,
                status
            FROM payroll_periods
            ORDER BY start_date DESC
            LIMIT 12
        `
        
        const result = await pool.query(query)
        return res.status(200).json(result.rows)
    } catch (err) {
        console.error("Error fetching periods:", err.message)
        return res.status(500).json({ 
            message: "Error fetching payroll periods",
            error: err.message 
        })
    }
})

// Get payroll data for a specific period
router.get("/payroll/:periodId", async (req, res) => {
    try {
        const { periodId } = req.params
        
        const query = `
            SELECT 
                u.user_id,
                u.first_name,
                u.last_name,
                u.employee_id,
                u.salary as basic_salary,
                COALESCE(pr.hours_worked, 0) as hours_worked,
                COALESCE(pr.overtime_hours, 0) as overtime_hours,
                COALESCE(pr.overtime_amount, 0) as overtime_amount,
                COALESCE(pr.deductions, 0) as deductions,
                COALESCE(pr.bonuses, 0) as bonuses,
                COALESCE(pr.gross_pay, u.salary) as gross_pay,
                COALESCE(pr.net_pay, u.salary) as net_pay,
                COALESCE(pr.status, 'pending') as status
            FROM users u
            LEFT JOIN payroll_records pr ON u.user_id = pr.user_id AND pr.period_id = $1
            WHERE u.status = 'active'
            ORDER BY u.last_name, u.first_name
        `
        
        const result = await pool.query(query, [periodId])
        
        // Calculate totals
        const totals = {
            totalGross: 0,
            totalDeductions: 0,
            totalNet: 0,
            totalHours: 0,
            totalOvertime: 0
        }
        
        result.rows.forEach(row => {
            totals.totalGross += parseFloat(row.gross_pay || 0)
            totals.totalDeductions += parseFloat(row.deductions || 0)
            totals.totalNet += parseFloat(row.net_pay || 0)
            totals.totalHours += parseFloat(row.hours_worked || 0)
            totals.totalOvertime += parseFloat(row.overtime_amount || 0)
        })
        
        return res.status(200).json({
            employees: result.rows,
            totals
        })
    } catch (err) {
        console.error("Error fetching payroll:", err.message)
        return res.status(500).json({ 
            message: "Error fetching payroll data",
            error: err.message 
        })
    }
})

// Generate payslip
router.post("/payroll/generate-payslip/:userId/:periodId", async (req, res) => {
    try {
        const { userId, periodId } = req.params
        
        const query = `
            SELECT 
                u.first_name,
                u.last_name,
                u.employee_id,
                u.position,
                u.salary,
                pr.*,
                pp.period_name,
                pp.start_date,
                pp.end_date,
                pp.pay_date
            FROM users u
            LEFT JOIN payroll_records pr ON u.user_id = pr.user_id AND pr.period_id = $2
            LEFT JOIN payroll_periods pp ON pp.period_id = $2
            WHERE u.user_id = $1
        `
        
        const result = await pool.query(query, [userId, periodId])
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }
        
        return res.status(200).json(result.rows[0])
    } catch (err) {
        console.error("Error generating payslip:", err.message)
        return res.status(500).json({ 
            message: "Error generating payslip",
            error: err.message 
        })
    }
})

export default router