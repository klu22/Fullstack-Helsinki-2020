const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')
const dummyUsers = require('./dummy_data').dummyUsers


const api = supertest(app.createApp())

beforeAll(app.connectToMongo)

beforeEach(async () => {
  await User.deleteMany({})
  await Promise.all(dummyUsers
    .map(user => new User(user))
    .map(userObj => userObj.save())
  )
})


describe('user GET', () => {
  
  test('Users are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('All users are returned', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(dummyUsers.length)
  })

  test('The name, username, id, and blogs fields exist', async () => {
    const response = await api.get('/api/users')
    response.body.map(user => {
      expect(user.name).toBeDefined()
      expect(user.username).toBeDefined()
      expect(user.id).toBeDefined()
      expect(user.blogs).toBeDefined()
    })
  })

  test('Users with blogs are populated with their blog data', async () => {
    const response = await api.get('/api/users')
    response.body.map(user => {
      if (user.blogs.length > 0) {
        user.blogs.map(blog => {
          expect(typeof(blog)).toBe('object')
          expect(blog.url).toBeDefined()
          expect(blog.title).toBeDefined()
          expect(blog.author).toBeDefined()
          expect(blog.id).toBeDefined()
        })
      }
    })
  })
})


describe('user POST', () => {
  
  const newUser = {
    username: 'kevin77',
    password: 'gr8pass',
    name: 'Kevin Wu',
    blogs: []
  }

  test('User count increases by 1 after adding a user', async () => {
    await api.post('/api/users').send(newUser)
    const updatedUserList = await User.find({})
    expect(updatedUserList).toHaveLength(dummyUsers.length + 1)
  })
  
  test('Password hash in DB corresponds to the plaintext pass', async () => {
    await api.post('/api/users').send(newUser)
    const newUserInDB = await User.findOne({ name: newUser.name })
    const pwHashIsValid = await bcrypt.compare(
      newUser.password, newUserInDB.passwordHash
    )
    expect(pwHashIsValid).toBe(true)
  })
  
  test('All non-password fields are saved correctly', async () => {
    const response = await api.post('/api/users').send(newUser)
    const newUserExceptPassword = (({ password, ...user }) => user)(newUser)
    expect(response.body).toMatchObject(newUserExceptPassword)
  })

  test('blogs defaults to [] if not specified', async () => {
    const newUserExceptBlogs = (({ blogs, ...user }) => user)(newUser)
    const response = await api.post('/api/users').send(newUserExceptBlogs)
    expect(response.body.blogs).toEqual([])
  })

  test('Send "400 Bad Request" if username is already in DB', async () => {
    const redundantUsernameUser = {...newUser, username:'fred123'}
    await api.post('/api/users').send(redundantUsernameUser)
      .expect(400)
  })
  
  test('Send "400 Bad Request" if username is missing', async () => {
    const noUsernameUser = (({ username, ...user }) => user)(newUser)
    await api.post('/api/users').send(noUsernameUser)
      .expect(400)
  })

  test('Send "400 Bad Request" if username length < 3', async () =>  {
    const shortUsernameUser = {...newUser, username:'aa'}
    await api.post('/api/users').send(shortUsernameUser)
      .expect(400)
  })

  test('Send "400 Bad Request" if password is missing', async () => {
    const userWithoutPassword = (({ password, ...user }) => user)(newUser)
    await api.post('/api/users').send(userWithoutPassword)
      .expect(400)
  })
  
  test('Send "400 Bad Request" if password length < 3', async () =>  {
    const shortPasswordUser = {...newUser, password:'hi'}
    await api.post('/api/users').send(shortPasswordUser)
      .expect(400)
  })
})


afterAll(() => mongoose.connection.close())