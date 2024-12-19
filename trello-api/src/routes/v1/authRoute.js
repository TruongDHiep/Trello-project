import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'


const Router = express.Router()

// Route cho đăng nhập
Router.post('/login', userValidation.login, userController.login)

// Route cho đăng ký
Router.post('/register', userValidation.createNew, userController.createNew)


export const authRoutes = Router
