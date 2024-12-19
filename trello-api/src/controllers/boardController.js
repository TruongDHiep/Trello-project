/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // console.log(req.body)

    // Call service
    const createBoard = await boardService.createNew(req.body)

    // Response
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id

    const board = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id

    const updatedBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {

    const result = await boardService.moveCardToDifferentColumn( req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getBoardsByUser = async (req, res) => {
  const { username } = req.params
  const boards = await boardService.getBoardsByUser(username)
  res.status(StatusCodes.OK).json(boards)
}

const findOneById = async (req, res) => {
  const { id } = req.params
  const board = await boardService.findOneById(id)
  res.status(StatusCodes.OK).json(board)
}

const findByOwnerIds = async (req, res) => {
  const { id } = req.params
  const board = await boardService.findByOwnerIds(id)
  res.status(StatusCodes.OK).json(board)
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoardsByUser,
  findOneById,
  findByOwnerIds
}
