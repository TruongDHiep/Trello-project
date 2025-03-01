/**
 */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().min(3).trim().strict(),
  description: Joi.string().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

//chi ra nhung truong ko cho phep update
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  try {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

  }
  catch (error) { throw new Error(error) }
}

const createNew = async (userId, data) => {
  try {

    const validData = await validateBeforeCreate(data)
    const newBoardToAdd = {
      ...validData,
      ownerIds: [new ObjectId(userId)]
    }
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(newBoardToAdd)
    return createdBoard
  }
  catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  }
  catch (error) { throw new Error(error) }
}

// su dung query tong hop aggregation de lay toan bo card va column cua board
const getDetails = async (userId, boardId) => {
  try {

    const queryConditions = [
      { _id: new ObjectId(boardId) },
      { _destroy: false },
      {
        $or: [{
          ownerIds: { $all: [new ObjectId(userId)] }
        },
        {
          memberIds: { $all: [new ObjectId(userId)] }
        }]
      }
    ]

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          $and: queryConditions
        }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id', // cua board
          foreignField: 'boardId', // cua column
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'ownerIds',
          foreignField: '_id',
          as: 'owners',
          pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'memberIds',
          foreignField: '_id',
          as: 'members',
          pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
        }
      }
    ]).toArray()
    return result[0] || null
  }
  catch (error) { throw new Error(error) }
}

const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )

    return result
  }
  catch (error) { throw new Error(error) }
}

const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )

    return result
  }
  catch (error) { throw new Error(error) }
}

const update = async (boardId, updateData) => {
  try {
    Object.keys(updateData).forEach((field) => {
      if (INVALID_UPDATE_FIELDS.includes(field)) {
        delete updateData[field]
      }
    })

    if (updateData.columnOrderIds) updateData.columnOrderIds = updateData.columnOrderIds.map(_id => new ObjectId(_id))

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result
  }
  catch (error) { throw new Error(error) }
}

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    const queryConditions = [
      // dieu kien 1: board chua bi xoa
      { _destroy: false },
      // dk2:
      {
        $or: [{
          ownerIds: { $all: [new ObjectId(userId)] }
        },
        {
          memberIds: { $all: [new ObjectId(userId)] }
        }]
      }
    ]

    const query = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate(
      [
        { $match: { $and: queryConditions } },
        { $sort: { title: 1 } },
        // de xu ly tong hop nhieu luong trong 1 query
        {
          $facet: {
            // luong 1: query boards
            'queryBoards': [
              { $skip: pagingSkipValue(page, itemsPerPage) }, // bo qua so luong boards cua nhung page truoc do
              { $limit: itemsPerPage } // gioi han toi da so luong boards tren 1 page
            ],
            //luong 2: query total boards
            'queryTotalBoards': [{ $count: 'countedAllBoards' }]

          }
        }
      ],
      { collation: { locale: 'en' } }
    ).toArray()

    const res = query[0]

    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0
    }
  }
  catch (error) { throw new Error(error) }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  getBoards
}

