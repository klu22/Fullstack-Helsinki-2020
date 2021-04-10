const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const dummyBlogs = require('./dummy_data').dummyBlogs
const dummyUsers = require('./dummy_data').dummyUsers


const api = supertest(app.createApp())

beforeAll(async() => {
  await app.connectToMongo()

  await Blog.deleteMany({})
  await Promise.all(dummyBlogs
    .map(blog => new Blog(blog))
    .map(blogObj => blogObj.save())
  )
  await User.deleteMany({})
  await Promise.all(dummyUsers
    .map(user => new User(user))
    .map(userObj => userObj.save())
  )
})


describe('login POST', () => {
  test('Send HTTP 401 Unauthorized if username not in DB.', async() => {
    const nonExistentUsername = 'bobRoss'
    const somePass = 'catdad86'
    const loginInfo = {
      username: nonExistentUsername,
      password: somePass
    }
    await api.post('/api/login').send(loginInfo)
      .expect(401)
  })

  test('Send HTTP 401 Unauthorized if password is incorrect.', async() => {
    const existentUsername = 'catdad86'
    const incorrectPass = 'catdad90'
    const loginInfo = {
      username: existentUsername,
      password: incorrectPass
    }
    await api.post('/api/login').send(loginInfo)
      .expect(401)
  })

  test('Send HTTP 200 & data if both username and pass are valid.', async() => {
    const existentUsername = 'catdad86'
    const correctPass = 'catdad86'
    const loginInfo = {
      username: existentUsername,
      password: correctPass
    }
    
    const user = await User.findOne({ username: existentUsername })
    expect(user).not.toBeNull()
    
    const expectedTokenData = {
      username: user.username,
      id: user.id // not user._id, which gives an ObjectId rather than String
    }

    const res = await api.post('/api/login').send(loginInfo)
      .expect(200)
    decodedResultToken = jwt.verify(res.body.token, process.env.SECRET)
    expect(decodedResultToken).toMatchObject(expectedTokenData)
    expect(res.body.username).toBe(user.username)
    expect(res.body.name).toBe(user.name)
  }) 
})

afterAll(() => mongoose.connection.close())