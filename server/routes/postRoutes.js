import express from 'express'
import authenticateUser from '../middleware/authMiddleware.js'
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from '../controller/postController.js'

const router = express.Router()

router.get('/', authenticateUser, getAllPosts)
router.post('/', authenticateUser, createPost)
router.get('/following', authenticateUser, getFollowingPosts)
router.get('/likes/:id', authenticateUser, getLikedPosts)
router.get('/user/:username', authenticateUser, getUserPosts)
router.post('/like/:id', authenticateUser, likeUnlikePost)
router.post('/comment/:id', authenticateUser, commentOnPost)
router.delete('/:id', authenticateUser, deletePost)

export default router
