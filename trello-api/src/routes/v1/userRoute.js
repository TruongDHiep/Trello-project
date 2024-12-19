import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { verifyToken } from '~/middlewares/authMiddleware'


const Router = express.Router()

Router.route('/')
  .post(userValidation.createNew, userController.createNew)

Router.route('/:id')
  .get(verifyToken, userController.getDetails)
  .put(verifyToken, userValidation.update, userController.update)
  .delete(verifyToken, userController.softDelete)


export const userRoutes = Router
