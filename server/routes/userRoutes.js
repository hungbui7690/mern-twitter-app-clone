import express from 'express'
import authenticateUser from '../middleware/authMiddleware.js'
import {
  getUserProfile,
  getSuggestedUsers,
  followUnfollowUser,
  updateUser,
} from '../controller/userController.js'

const router = express.Router()

router.get('/profile/:username', authenticateUser, getUserProfile)
router.post('/follow/:id', authenticateUser, followUnfollowUser)
router.get('/suggested', authenticateUser, getSuggestedUsers)
router.patch('/update', authenticateUser, updateUser)

export default router
