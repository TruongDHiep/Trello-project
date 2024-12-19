
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []

      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)


    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  // eslint-disable-next-line no-useless-catch
  try {

    const targetColumn = await columnModel.findOneById(columnId)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found !')
    }


    // xoa column
    await columnModel.deleteOneById(columnId)

    // xoa card thuoc column
    await cardModel.deleteManyByColumnId(columnId)

    // xoa columnId trong board
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its cards were deleted successfully !' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}