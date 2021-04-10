const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (_, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1, name: 1, id: 1 
  })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res, next) => {
  if (! ('title' in req.body)) {
    next(`Invalid blog POST: missing title. ${JSON.stringify(req.body)}`)
  } if (! ('url' in req.body)) {
    next(`Invalid blog POST: missing URL. ${JSON.stringify(req.body)}`)
  } 
  next()
}, async (req, res, next) => {
  const blogToSave = new Blog({
    ...req.body,
    'likes': ('likes' in req.body) ? req.body.likes : 0
  })
  try {
    const savedBlog = await blogToSave.save()
    const user = await User.findById(savedBlog.user)
    user.blogs.push(savedBlog.id)
    await user.save()
    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  const blogId = req.params.id
  try {
    const blogToDelete = await Blog.findById(blogId)
    if (String(blogToDelete.user) !== req.body.user) {
      next({
        http: 401,
        message: `Invalid auth token. ${JSON.stringify(req.body)}`
      })
    }
    await Blog.findByIdAndDelete(blogId)
    const user = await User.findById(req.body.user)
    user.blogs.splice(user.blogs.indexOf(blogId), 1)
    user.save()
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})


module.exports = blogsRouter