import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'; // Đảm bảo rằng bí mật JWT được cấu hình chính xác

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().required().min(8),
  username: Joi.string().required().min(3).max(20).trim().strict(),
  displayName: Joi.string().min(3).max(50).trim().strict(),
  avatar: Joi.string().uri(),
  role: Joi.string().valid('client', 'admin').default('client'),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string().allow(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})


const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

const createJwtToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' }) // Hoặc thời gian hết hạn khác
}

const createNew = async (data) => {
  try {
    // Xác thực dữ liệu đầu vào
    const validData = await validateBeforeCreate(data)

    // Thiết lập các thuộc tính mặc định
    validData.username = validData.username || validData.email.split('@')[0];
    validData.displayName = validData.displayName || validData.email.split('@')[0];
    validData.avatar = validData.avatar || 'https://example.com/default-avatar.png';

    // Mã hóa mật khẩu
    validData.password = await hashPassword(validData.password)

    // Lưu thông tin người dùng vào cơ sở dữ liệu
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)

    // Tạo token JWT và gán vào createdUser
    const verifyToken = createJwtToken(createdUser.insertedId) // Sử dụng insertedId để lấy _id mới
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: createdUser.insertedId },
      { $set: { verifyToken: verifyToken } }
    )

    return createdUser
  }
  catch (error) {
    throw new Error(error)
  }
}


const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  }
  catch (error) { throw new Error(error) }
}

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return result
  }
  catch (error) { throw new Error(error) }
}

const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach((field) => {
      if (INVALID_UPDATE_FIELDS.includes(field)) {
        delete updateData[field]
      }
    })

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password)
    }

    updateData.updatedAt = Date.now()

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result
  }
  catch (error) { throw new Error(error) }
}

const softDelete = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { _destroy: true, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )

    return result
  }
  catch (error) { throw new Error(error) }
}

const validateBeforeCreate = async (data) => {
  try {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  }
  catch (error) { throw new Error(error) }
}


export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  update,
  softDelete,
  validateBeforeCreate
}
