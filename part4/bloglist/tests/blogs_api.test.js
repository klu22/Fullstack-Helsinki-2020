const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const dummyBlogs = require('./dummy_data').dummyBlogs
const dummyUsers = require('./dummy_data').dummyUsers


const api = supertest(app.createApp())

beforeAll(app.connectToMongo)

beforeEach(async() => {
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


describe('blog GET', () => {

  test('Blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(dummyBlogs.length)
  })

  test('The "id" field is correctly named', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => expect(blog.id).toBeDefined())
  })

  test('The "user" field is populated with user data', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => {
      expect(blog.user).toBeDefined()
      expect(blog.user.username).toBeDefined()
      expect(blog.user.id).toBeDefined()
    })
  })
})


describe('blog POST', () => {

  const newBlog = {  
    'title': 'Test Blog',
    'author': 'Bob Smith',
    'url': 'bobsmithsblog.com',
    'likes': 9001
  }
  const tokenInput = {
    username: dummyUsers[0].username,
    id: dummyUsers[0]._id
  }
  const validToken = jwt.sign(tokenInput, process.env.SECRET)


  test('Blog is saved if auth token is valid', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlog)
    expect(response.body).toMatchObject(newBlog) 

    const updatedBlogList = await Blog.find({})
    expect(updatedBlogList).toHaveLength(dummyBlogs.length + 1) 
  })

  test('Blog\'s "user" field is the decoded token\'s "id" field', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlog)
    const user = response.body.user
    const tokenID = jwt.verify(validToken, process.env.SECRET).id
    expect(user).toBe(tokenID)
  })
  
  test('Blog ID is appended to its creator\'s blogs array', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlog)
    const savedBlog = response.body
    const user = await User.findById(savedBlog.user)
    const userBlogIDs = user.blogs.map(blogID => blogID.toString())
    expect(userBlogIDs).toContain(savedBlog.id)
  })

  test('Send 401 Unauthorized if auth token is invalid', async () => {
    const invalidToken = 'blahblahblah'
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(newBlog)
      .expect(401)
  })

  test('Send 401 Unauthorized if auth token is missing', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('Blog\'s "likes" defaults to 0', async () => {
    const blogMissingLikes = (({ likes, ...blog }) => blog)(newBlog)
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(blogMissingLikes)
    expect(response.body.likes).toBe(0)
  })

  test('Send 400 Bad Request if "title" is missing', async () => {
    const blogMissingTitle = (({ title, ...blog }) => blog)(newBlog)
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(blogMissingTitle)
      .expect(400)
  })

  test('Send 400 Bad Request if "url" is missing', async () => {
    const blogMissingURL = (({ url, ...blog }) => blog)(newBlog)
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(blogMissingURL)
      .expect(400)
  })
})


describe('blog DELETE', () => {
  
  const testBlog = dummyBlogs[0]
  const creator = dummyUsers.find(user => user._id === testBlog.user)
  const tokenInput = {
    username: creator.username,
    id: creator._id
  }
  const validToken = jwt.sign(tokenInput, process.env.SECRET)


  test('Blog is deleted if token is valid', async () => {
    await api
      .delete(`/api/blogs/${testBlog._id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(204)
    const updatedBlogList = await Blog.find({})
    expect(updatedBlogList).not.toContain(testBlog)
    expect(updatedBlogList).toHaveLength(dummyBlogs.length - 1)
  })

  test('The blog\'s id is removed from its creator\'s blog list', async () => {
    await api
      .delete(`/api/blogs/${testBlog._id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(204)
    const updatedUser = await User.findById(testBlog.user)
    expect(updatedUser.blogs).not.toContain(testBlog._id)
  }) 

  test('Send 401 Unauthorized if token is invalid', async () => {
    const invalidToken = 'blahblahblah'
    await api
      .delete(`/api/blogs/${testBlog._id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401)
  })

  test('Send 401 Unauthorized if token is missing', async () => {
    await api
      .delete(`/api/blogs/${testBlog._id}`)
      .expect(401)
  })
})


afterAll(() => mongoose.connection.close())