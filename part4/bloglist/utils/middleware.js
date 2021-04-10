const assert = require('assert')
const jwt = require('jsonwebtoken')

const logger = require('./logger')
const User = require('../models/user')


const extractTokenToBody = (req, _, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    req.body['token'] = token 
  } else {
    req.body['token'] = null
  }
  next()
}

const logRequest = (req, _, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const extractUserIdToBody = async (req, _, next) => {
  if (! ['POST', 'DELETE'].includes(req.method)) {
    return next() 
  } try {
    const decodedToken = jwt.verify(req.body.token, process.env.SECRET)
    assert (await User.exists({ _id: decodedToken.id  }))
    req.body['user'] = decodedToken.id
    next()
  } catch {
    next({
      http: 401,
      message: `Invalid auth token. ${JSON.stringify(req.body)}`
    })
  }
}

const unknownEndpointHandler = (_, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (typeof(err) === 'string') {
    return res.status(400).json({ error: err })
  } else if (typeof(err) === 'object' && 'http' in err) {
    return res.status(err.http).json({ error: err.message })
  } else {
    return res.status(400).send('Request failed for an unknown reason.')
  }
}


module.exports = {
  extractTokenToBody,
  logRequest,
  extractUserIdToBody,
  unknownEndpointHandler,
  errorHandler
}