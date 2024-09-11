import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes } from 'http-status-codes'
import User from '../model/User.js'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import Notification from '../model/Notification.js'

export const getUserProfile = async (req, res) => {
  // get the username from the params
  const { username } = req.params

  // find the user in the database
  const user = await User.findOne({ username }).select('-password')

  // if user not found, throw an error
  if (!user) throw new BadRequestError('User not found')

  // return the user
  res.status(StatusCodes.OK).json(user)
}

/*
  - when follow/unfollow a user, we need to modify currentUser.followings[] and followingUser.followers[] -> if currentUser already follows followingUser, then unfollow them
  - example: 
    + Joe follows Alex
    + Alex.followers[] = [Joe]
    + Joe.followings[] = [Alex]
    -> in this example we place the name in the array -> but in the real world, we place the id here
*/
export const followUnfollowUser = async (req, res) => {
  // get following user from request params object
  const { id } = req.params

  // get followingUser and currentUser
  const followingUser = await User.findById(id)
  const currentUser = await User.findById(req.user._id)

  // return an error if user tries to follow/unfollow themselves
  if (id === req.user._id.toString()) {
    throw new BadRequestError("You can't follow/unfollow yourself")
  }

  // return an error if either user is not found
  if (!followingUser || !currentUser)
    throw new BadRequestError('User not found')

  // check if the user is already followed
  const isFollowing = currentUser.following.includes(id)

  if (isFollowing) {
    // if user is already followed, unfollow them
    await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })

    res.status(StatusCodes.OK).json({ message: 'User unfollowed successfully' })
  } else {
    // if user is not followed, follow them
    await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
    await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })

    // Send notification to the following user
    const newNotification = new Notification({
      type: 'follow',
      from: req.user._id,
      to: followingUser._id,
    })
    await newNotification.save()

    res.status(StatusCodes.OK).json({ message: 'User followed successfully' })
  }
}

export const getSuggestedUsers = async (req, res) => {
  // get current user
  const userId = req.user._id

  // get following users
  const usersFollowedByMe = await User.findById(userId).select('following')

  // get 10 random users
  const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: userId },
      },
    },
    { $sample: { size: 10 } }, // Appends new custom $sample operator to this aggregate pipeline -> The $sample stage has the following syntax: { $sample: { size: <positive integer> } } -> Add a pipeline that picks 10 random documents
  ])

  // from 10 random users, we will find the ones who haven't followed currentUser
  const filteredUsers = users.filter(
    (user) => !usersFollowedByMe.following.includes(user._id)
  )

  // get just 4 random users from previous step
  const suggestedUsers = filteredUsers.slice(0, 4)

  // remove password
  suggestedUsers.forEach((user) => (user.password = null))

  res.status(StatusCodes.OK).json(suggestedUsers)
}

export const updateUser = async (req, res) => {
  // get all fields from request body object
  const {
    fullName,
    email,
    username,
    currentPassword,
    newPassword,
    bio,
    link,
    profileImg,
    coverImg,
  } = req.body

  // get currentUser id
  const userId = req.user._id

  // get currentUser
  let user = await User.findById(userId)
  if (!user) throw new NotFoundError('User not found')

  // in case currentPassword exists, check if it matches with the user's password
  if (currentPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) throw new BadRequestError('Current password is incorrect')
  }

  // in case newPassword exists, check if it is at least 6 characters long
  if (newPassword) {
    if (newPassword.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters long')
    }

    // update password with newPassword
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
  }

  // change profileImg
  if (profileImg) {
    // if user has profileImg, delete it
    if (user.profileImg) {
      // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/[zmxorcxexpdbh8r0bkjb.png]
      // user.profileImg.split('/').pop() -> [zmxorcxexpdbh8r0bkjb].[png]
      await cloudinary.uploader.destroy(
        user.profileImg.split('/').pop().split('.')[0] // filename without extension
      )
    }

    // upload new profileImg
    const uploadedResponse = await cloudinary.uploader.upload(profileImg)
    profileImg = uploadedResponse.secure_url
  }

  // change coverImg
  if (coverImg) {
    // if user has coverImg, delete it
    if (user.coverImg) {
      await cloudinary.uploader.destroy(
        user.coverImg.split('/').pop().split('.')[0]
      )
    }

    // upload new coverImg
    const uploadedResponse = await cloudinary.uploader.upload(coverImg)
    coverImg = uploadedResponse.secure_url
  }

  // update other fields
  user.fullName = fullName || user.fullName
  user.email = email || user.email
  user.username = username || user.username
  user.bio = bio || user.bio
  user.link = link || user.link
  user.profileImg = profileImg || user.profileImg
  user.coverImg = coverImg || user.coverImg

  // save the user
  user = await user.save()

  // password should be null in response
  user.password = null

  return res.status(StatusCodes.OK).json(user)
}
