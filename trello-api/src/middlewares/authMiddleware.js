import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' + error })
  }
}