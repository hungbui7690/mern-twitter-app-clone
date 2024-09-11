import express from 'express'
import { login, signup, logout } from '../controller/authController.js'
import authenticateUser from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/getMe', authenticateUser, logout)

export default router
