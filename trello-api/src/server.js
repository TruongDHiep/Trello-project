/* eslint-disable no-console */


import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from '~/config/cors.js'

const START_SERVER = () => {

  const app = express()

  //xu ly cors
  app.use(cors(corsOptions))

  // enable json body parsing
  app.use(express.json())

  app.use('/v1', APIs_V1)

  // middleware xu lu loi tap trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

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