import express from 'express'
import authenticateUser from '../middleware/authMiddleware.js'
import {
  deleteAllNotifications,
  getAllNotifications,
  deleteNotification,
} from '../controller/notificationController.js'

const router = express.Router()

router.get('/', authenticateUser, getAllNotifications)
router.delete('/', authenticateUser, deleteAllNotifications)
router.delete('/:id', authenticateUser, deleteNotification)

export default router
