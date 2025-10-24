import express from "express"
import bcrypt from 'bcrypt'
import pool from "../db/pool.js"

const router = express.Router()

const saltRounds = 10

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const trueEmail = email.toLowerCase().trim()
        const findUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [trueEmail]
        )
        if (findUser.rows.length === 0) return res.status(400).json({ message: "User with this email doesnt exist" })
        const user = findUser.rows[0]
        const isValid = bcrypt.compare(password, user.password)
        if (!isValid) {
            console.log("Incorrect password")
            return res.status(401).json({ message: "Incorrect password" })
        }
        return res.status(200).json({ 
            message: "Account found",
            user: user
        })
    } catch (err) {
        console.error(err.message)
    }
})

export default router