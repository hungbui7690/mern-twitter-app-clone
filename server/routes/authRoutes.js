import express from 'express'
import { login, signup, logout, getMe } from '../controller/authController.js'
import authenticateUser from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authenticateUser, getMe)

export default router
