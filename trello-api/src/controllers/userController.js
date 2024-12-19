import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'


const createNew = [
  async (req, res, next) => {
    try {
      const createdUser = await userService.createNew(req.body)
      res.status(StatusCodes.CREATED).json(createdUser)
    } catch (error) { next(error) }
  }
]

const getDetails = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await userService.getDetails(userId)
    res.status(StatusCodes.OK).json(user)
  } catch (error) { next(error) }
}

const update = [
  async (req, res, next) => {
    try {
      const userId = req.params.id
      const updatedUser = await userService.update(userId, req.body)
      res.status(StatusCodes.OK).json(updatedUser)
    } catch (error) { next(error) }
  }
]

const softDelete = async (req, res, next) => {
  try {
    const userId = req.params.id
    const result = await userService.softDelete(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await userService.login(email, password) // Tạo hàm login trong userService
    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '1h' }) // Tạo token
    res.status(StatusCodes.OK).json({ token })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  getDetails,
  update,
  softDelete,
  login
}