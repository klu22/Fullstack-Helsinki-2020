const listHelper = require('../utils/list_helper')
const blogList = require('./dummy_data').dummyBlogs

const dummy = listHelper.dummy
const totalLikes = listHelper.totalLikes
const favoriteBlog = listHelper.favoriteBlog
const mostBlogs = listHelper.mostBlogs
const mostLikes = listHelper.mostLikes


test('dummy returns one', () => {
  const result = dummy(blogList)
  expect(result).toBe(1)
})


describe('totalLikes', () => {

  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('of a single-blog list is that blog\'s number of likes', () => {
    expect(totalLikes([blogList[0]])).toBe(blogList[0].likes)
  })

  test('of a bigger list is the sum of all likes therein', () => {
    expect(totalLikes(blogList)).toBe(36)
  })
})


describe('favoriteBlog', () => {

  test('of empty list is null', () => {
    expect(favoriteBlog([])).toBe(null)
  })

  test('of a single-blog list is simply that blog', () => {
    expect(favoriteBlog([blogList[0]]))
      .toMatchObject({
        _id: "5a422a851b54a676234d17f7", 
        title: "React patterns", 
        author: "Michael Chan", 
        url: "https://reactpatterns.com/", 
        likes: 7, 
        __v: 0 
      })   
  })

  test('of a bigger list is the blog with the most likes', () => {
    expect(favoriteBlog(blogList))
      .toMatchObject({ 
        _id: "5a422b3a1b54a676234d17f9", 
        title: "Canonical string reduction", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
        likes: 12, 
        __v: 0 
      })
  })
})


describe('mostBlogs', () => {

  test('of empty list is null', () => {
    expect(mostBlogs([])).toBe(null)
  })

  test('of a single-blog list is {author: [name], blogs: 1}', () => {
    expect(mostBlogs([blogList[0]]))
      .toEqual({
        author: 'Michael Chan',
        blogs: 1
      })
  })

  test('of a bigger list is {author: [name], blogs: [count]} for an '
    + 'author with the most blogs', () => {
      expect(mostBlogs(blogList))
        .toEqual({
          author: 'Robert C. Martin', 
          blogs: 3
        })
    }
  )
})


describe('mostLikes', () => {

  test('of empty list is null', () => {
    expect(mostLikes([])).toBe(null)
  })

  test('of a single-blog list is {author: [name], likes: [total]}', () => {
    expect(mostLikes([blogList[0]]))
      .toEqual({
        author: 'Michael Chan', 
        likes: 7
      })
  })

  test('of a bigger list is {author: [name], likes: [total]} for an '
    + 'author with the most likes', () => {
      expect(mostLikes(blogList))
        .toEqual({
          author: 'Edsger W. Dijkstra',
          likes: 17
        })
  })
})

