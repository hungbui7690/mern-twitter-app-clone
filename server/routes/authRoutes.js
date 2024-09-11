import express from 'express'
import { login, signup, logout } from '../controller/authController.js'
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

export default router
