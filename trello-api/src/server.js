import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from '~/config/cors.js'
import cookieParser from 'cookie-parser'

import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from '~/sockets/inviteUserToBoardSocket'

const START_SERVER = () => {

  const app = express()

  // fix cache from disk
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())

  //xu ly cors
  app.use(cors(corsOptions))

  // enable json body parsing
  app.use(express.json())

  app.use('/v1', APIs_V1)

  // middleware xu lu loi tap trung
  app.use(errorHandlingMiddleware)

  // tao 1 server boc thang app cua express de lam real time
  const server = http.createServer(app)
  // khoi tao bien io voi server va cors
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
  })

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`Production: Hello ${env.AUTHOR}, Backend server is running at Port: ${process.env.PORT}`)
    })
  }
  else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
    })
  }

  exitHook(() => {
    console.log('Closing MongoDB connection...')
    CLOSE_DB()
    console.log('Closed MongoDB connection')
  })
}

(async () => {
  try {
    console.log('Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('Connected to MongoDB')
    START_SERVER()
  }
  catch (error) {
    console.error(error)
    process.exit(1)
  }
})()


// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(1)
//   })