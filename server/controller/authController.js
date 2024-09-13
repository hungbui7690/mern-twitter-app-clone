import { generateTokenAndSetCookie } from '../utils/generateToken.js'
import User from '../model/User.js'
import bcrypt from 'bcryptjs'
import { BadRequestError } from '../errors/index.js'
import { StatusCodes } from 'http-status-codes'

export const signup = async (req, res) => {
  // extract data from request body
  const { fullName, username, email, password } = req.body
  console.log(req.body)

  // write a regex to check if email is valid or not and throw an error if it is not
  const isEmailValid =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (!isEmailValid.test(email))
    throw new BadRequestError('Invalid email format')

  // check if user already exists in the database
  const isUserExist = await User.findOne({ username })
  if (isUserExist) {
    throw new BadRequestError('Username is already taken')
  }

  // check if email already exists in the database
  const isEmailExist = await User.findOne({ email })
  if (isEmailExist) throw new BadRequestError('Email is already taken')

  // check if password is at least 6 characters long
  if (password.length < 6)
    throw new BadRequestError('Password must be at least 6 characters long')

  // hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // create a new user
  const newUser = new User({
    fullName,
    username,
    email,
    password: hashedPassword,
  })

  // throw an error if user could not be created
  if (!newUser) throw new BadRequestError('Could not create user')

  // save the user to the database
  generateTokenAndSetCookie(newUser._id, res)
  await newUser.save()

  // send the response
  res.status(StatusCodes.CREATED).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    username: newUser.username,
    email: newUser.email,
    followers: newUser.followers,
    following: newUser.following,
    profileImg: newUser.profileImg,
    coverImg: newUser.coverImg,
  })
}

export const login = async (req, res) => {
  // extract data from request body
  const { username, password } = req.body

  // check if user exists in the database
  const user = await User.findOne({ username })
  // compare the password from the request body with the password from the database
  const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')

  // throw an error if user does not exist or password is incorrect
  if (!user || !isPasswordCorrect) {
    throw new BadRequestError('Invalid username or password')
  }

  // generate token and set cookie
  generateTokenAndSetCookie(user._id, res)

  // send the response
  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profileImg: user.profileImg,
    coverImg: user.coverImg,
  })
}

export const logout = async (req, res) => {
  // clear the cookie
  res.cookie('token', '', { maxAge: 0 })
  res.status(StatusCodes.OK).json({ message: 'Logged out successfully' })
}

export const getMe = async (req, res) => {
  // get user from req.user
  const user = await User.findById(req.user._id).select('-password')
  res.status(StatusCodes.OK).json(user)
}
