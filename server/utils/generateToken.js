import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (userId, res) => {
  // create new token with jwt secret
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  })

  // attach token to signed cookie
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}
