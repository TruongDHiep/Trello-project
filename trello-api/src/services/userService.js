import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'


const createNew = async (data) => {
  try {
    const existingUser = await userModel.findOneByEmail(data.email)
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
    }

    const createdUser = await userModel.createNew(data)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    return getNewUser
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    throw error
  }
}

const update = async (userId, updateData) => {
  try {
    const updatedUser = await userModel.update(userId, updateData)
    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return updatedUser
  } catch (error) {
    throw error
  }
}

const softDelete = async (userId) => {
  try {
    const result = await userModel.softDelete(userId)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return result
  } catch (error) {
    throw error
  }
}

const login = async (email, password) => {
  const user = await userModel.findOneByEmail(email)
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
  }

  return user
}


export const userService = {
  createNew,
  getDetails,
  update,
  softDelete,
  login
}