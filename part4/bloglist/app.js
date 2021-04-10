const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')


const connectToMongo = async () => {
  logger.info('Connecting to', config.MONGODB_URI)
  try {
    await mongoose.connect(config.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      useFindAndModify: false, 
      useCreateIndex: true 
    })
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(`Error connecting to MongoDB: ${err.message}`)
  }
}

const createApp = () => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(middleware.extractTokenToBody)
  app.use(middleware.logRequest)
  
  app.use('/api/blogs', middleware.extractUserIdToBody, blogsRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/login', loginRouter)

  app.use(middleware.unknownEndpointHandler)
  app.use(middleware.errorHandler)
  
  return app
}

module.exports = { connectToMongo, createApp }