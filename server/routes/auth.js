import express from "express"
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import pool from "../db/pool.js"

const router = express.Router()
const saltRounds = 10

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profile-pictures'
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        // Generate unique filename: employeeId-timestamp.extension
        const uniqueName = `${req.body.employeeId}-${Date.now()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)
        
        if (mimetype && extname) {
            return cb(null, true)
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'))
        }
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const trueEmail = email.toLowerCase().trim()
        const findUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [trueEmail]
        )
        if (findUser.rows.length === 0) {
            return res.status(400).json({ message: "User with this email doesnt exist" })
        }
        const user = findUser.rows[0]
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            console.log("Incorrect password")
            return res.status(401).json({ message: "Incorrect password" })
        }
        
        // Remove password from response
        delete user.password
        
        return res.status(200).json({ 
            message: "Account found",
            user: user
        })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ message: "Error logging in" })
    }
})

router.post("/create-account", upload.single('profilePicture'), async (req, res) => {
    try {
        const { firstName, lastName, email, employeeId, password, role, payGrade, phone, position, hireDate } = req.body
        
        let salary
        switch (parseInt(payGrade)) {
            case 1: salary = 13000; break
            case 2: salary = 15000; break
            case 3: salary = 18000; break
            case 4: salary = 22000; break
            case 5: salary = 25000; break
            case 6: salary = 30000; break
            case 7: salary = 35000; break
            case 8: salary = 40000; break
            case 9: salary = 55000; break
            case 10: salary = 60000; break
            default:
                return res.status(400).json({ message: "Invalid pay grade" })
        }
        
        // Check if employee already exists
        const exists = await pool.query("SELECT * FROM users WHERE employee_id = $1", [employeeId])
        if (exists.rows.length > 0) {
            // Delete uploaded file if it exists
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            return res.status(400).json({ message: "User with this employee ID already exists." })
        }
        
        // Check if email already exists
        const emailExists = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()])
        if (emailExists.rows.length > 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            return res.status(400).json({ message: "User with this email already exists." })
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        // Get profile picture URL if uploaded
        const profilePictureUrl = req.file ? `/uploads/profile-pictures/${req.file.filename}` : null
        
        const result = await pool.query(
            `INSERT INTO
                users (employee_id, first_name, last_name, email, phone, password, role, pay_grade, salary, position, profile_picture_url, hire_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *
            `,
            [employeeId, firstName, lastName, email.toLowerCase().trim(), phone, hashedPassword, role, payGrade, salary, position, profilePictureUrl, hireDate]
        )
        
        // Remove password from response
        const user = result.rows[0]
        delete user.password
        
        return res.status(201).json({ 
            message: "Account created successfully",
            user: user
        })
    } catch (err) {
        console.error(err.message)
        // Delete uploaded file if there was an error
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
        return res.status(500).json({ message: "Error creating account" })
    }
})

export default router