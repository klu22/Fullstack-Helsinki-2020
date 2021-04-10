const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')

const User = require('../models/user')


usersRouter.get('/', async (req, res, next) => {
  const users = await User.find({}).populate('blogs', {
    url: 1, title: 1, author: 1, id: 1
  })
  res.json(users)
})

usersRouter.post('/', (req, res, next) => {
  if (! ('password' in req.body)) {
    next(`Invalid user POST: missing password.`)
  } else if (req.body.password.length < 3) {
    next(`Invalid user POST: password length < 3.`)
  } else {
    next()
  }
}, async (req, res, next) => {
  const body = req.body

  const saltRounds = 10

  const userToAdd = new User({
    username: body.username,
    passwordHash: await bcrypt.hash(body.password, saltRounds),
    name: body.name,
    blogs: ('blogs' in body) ? body.blogs : []
  })
  try {
    const result = await userToAdd.save()
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})


module.exports = usersRouter