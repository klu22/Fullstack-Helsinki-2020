const loginRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')


loginRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({ username: body.username })
  const isLoginValid = user === null ? false 
    : await bcrypt.compare(body.password, user.passwordHash)
  if (!isLoginValid) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

  const tokenInput = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(tokenInput, process.env.SECRET)
  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter