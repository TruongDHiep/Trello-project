

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoute'
import { columnRoutes } from './columnRoute'
import { cardRoutes } from './cardRoute'
import { userRoutes } from './userRoute'
import { authRoutes } from './authRoute'
import { invitationRoutes } from './invitationRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'APIs V1 is ready'
  })
})

// Boards APIs
Router.use('/boards', boardRoutes)

// column
Router.use('/columns', columnRoutes)

//card
Router.use('/cards', cardRoutes)

//user
Router.use('/users', userRoutes)

//login
Router.use('/', authRoutes)

//invitation
Router.use('/invitations', invitationRoutes)


export const APIs_V1 = Router