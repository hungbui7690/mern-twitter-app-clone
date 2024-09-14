import { v2 as cloudinary } from 'cloudinary'
import User from '../model/User.js'
import Notification from '../model/Notification.js'
import Post from '../model/Post.js'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'

export const createPost = async (req, res) => {
  const { text } = req.body
  let img = req.files?.img.tempFilePath
  const currentUserID = req.user._id.toString()

  // find the current user
  const currentUser = await User.findById(currentUserID)
  if (!currentUser) throw new NotFoundError('User not found')

  // if text and img are not present, throw an error
  if (!text && !img) {
    throw new BadRequestError('Post must have text or image')
  }

  // if img is present, upload it to cloudinary
  if (img) {
    const uploadedResponse = await cloudinary.uploader.upload(img)
    fs.unlinkSync(img)
    img = uploadedResponse.secure_url
  }

  // create new post
  const newPost = new Post({
    user: currentUser._id,
    text,
    img,
  })

  // save the post
  await newPost.save()

  // return the post
  res.status(StatusCodes.CREATED).json(newPost)
}

export const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'comments.user',
      select: '-password',
    })

  if (posts.length === 0) {
    return res.status(200).json([])
  }

  res.status(200).json(posts)
}

export const getFollowingPosts = async (req, res) => {
  const userId = req.user._id

  // get currentUser
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ error: 'User not found' })

  // get currentUser's following list
  const following = user.following // return an array of user ids

  // *** get posts of users in the following list
  // https://mongoosejs.com/docs/queries.html
  // { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
  // {"breed" : { $in : ["Pitbull", "Great Dane", "Pug"]}}
  const feedPosts = await Post.find({ user: { $in: following } })
    .sort({ createdAt: -1 })
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'comments.user',
      select: '-password',
    })

  res.status(200).json(feedPosts)
}

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id

  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'comments.user',
      select: '-password',
    })

  res.status(200).json(likedPosts)
}

// get posts of a specific user
export const getUserPosts = async (req, res) => {
  const { username } = req.params

  // find the user by username
  const user = await User.findOne({ username })
  if (!user) return res.status(404).json({ error: 'User not found' })

  // get posts of the user
  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'comments.user',
      select: '-password',
    })

  res.status(200).json(posts)
}

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id)

  // if post not found, throw an error
  if (!post) throw new NotFoundError('Post not found')

  // if the user is not the owner of the post, throw an error
  if (post.user.toString() !== req.user._id.toString()) {
    throw new UnauthenticatedError('You are not authorized to delete this post')
  }

  // if the post has an image, delete it from cloudinary
  if (post.img) {
    const imgId = post.img.split('/').pop().split('.')[0]
    await cloudinary.uploader.destroy(imgId)
  }

  // delete the post
  await Post.findByIdAndDelete(req.params.id)

  // return a success message
  res.status(StatusCodes.OK).json({ message: 'Post deleted successfully' })
}

export const commentOnPost = async (req, res) => {
  const { text } = req.body
  const postId = req.params.id
  const userId = req.user._id

  // if text is not present, throw an error
  if (!text) throw new BadRequestError('Text field is required')

  // find the post by id
  const post = await Post.findById(postId)

  // if post not found, throw an error
  if (!post) throw new NotFoundError('Post not found')

  // create a new comment object
  const comment = { user: userId, text }

  // add the comment to the post
  post.comments.push(comment)
  await post.save()

  res.status(StatusCodes.OK).json(post)
}

export const likeUnlikePost = async (req, res) => {
  const userId = req.user._id
  const { id: postId } = req.params

  // find post
  const post = await Post.findById(postId)
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }
  // find user
  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  // Check if user has already liked the post
  const userLikedPost = post.likes.includes(userId)

  // If user has already liked the post, unlike it
  if (userLikedPost) {
    // Unlike post
    post.likes.pull(userId)
    user.likedPosts.pull(postId)
    Promise.all([await post.save(), await user.save()])

    res.status(200).json(post.likes)
  } else {
    // If user has not liked the post, like it
    post.likes.push(userId)
    user.likedPosts.push(postId)
    Promise.all([await post.save(), await user.save()])

    // update notification
    const notification = new Notification({
      from: userId,
      to: post.user,
      type: 'like',
    })
    await notification.save()

    const updatedLikes = post.likes
    res.status(200).json(updatedLikes)
  }
}
