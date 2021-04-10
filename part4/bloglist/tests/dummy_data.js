const dummyBlogs = [ 
  { 
    _id: '5a422a851b54a676234d17f7', 
    title: 'React patterns', 
    author: 'Michael Chan', 
    user: '77422bc61b54a676234d17fc',
    url: 'https://reactpatterns.com/', 
    likes: 7, 
    __v: 0 
  }, 
  { _id: '5a422aa71b54a676234d17f8', 
    title: 'Go To Statement Considered Harmful', 
    author: 'Edsger W. Dijkstra', 
    user: '77422bc61b54a676234d17fc',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 
    likes: 5, 
    __v: 0 
  }, 
  { _id: '5a422b3a1b54a676234d17f9', 
    title: 'Canonical string reduction', 
    author: 'Edsger W. Dijkstra', 
    user: '77422bc61b54a676234d17fc',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12,
     __v: 0 
    }, 
  { 
    _id: '5a422b891b54a676234d17fa', 
    title: 'First class tests', 
    author: 'Robert C. Martin', 
    user: '77422bc61b54a676234d17fc',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', 
    likes: 10, 
    __v: 0 
  }, 
  { 
    _id: '5a422ba71b54a676234d17fb', 
    title: 'TDD harms architecture', 
    author: 'Robert C. Martin', 
    user: '77422bc61b54a676234d17fc',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', 
    likes: 0, 
    __v: 0 
  }, 
  { 
    _id: '5a422bc61b54a676234d17fc', 
    title: 'Type wars', 
    author: 'Robert C. Martin', 
    user: '77422bc61b54a676234d17fc',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2, 
    __v: 0 
  }
]

// Dummy users' plaintext passwords are just their usernames. 
const dummyUsers = [
  {
    _id: '63422bc61b54a676234d17fc',
    username: 'fred123',
    passwordHash: '$2a$10$UbFk1uhYJZIMgsjc8pQ.O.XgBWRgjAGEmafn5JGZAAfplnTd/.SDa',
    name: 'Fred Fred',
    blogs: [
      '5a422a851b54a676234d17f7','5a422aa71b54a676234d17f8', '5a422b3a1b54a676234d17f9', '5a422b891b54a676234d17fa', '5a422ba71b54a676234d17fb', '5a422bc61b54a676234d17fc'
    ],
    __v: 0
  },
  {
    _id: '77422bc61b54a676234d17fc',
    username: 'catdad86',
    passwordHash: '$2a$10$bjMFk9uqBvaRVdzQ.zO0GOTNwQXTNwAJMDho37rSawucpXdrekmRy',
    name: 'Bob Smith',
    blogs: [],
    __v: 0
  },
  {
    _id: '88422bc61b54a676234d17fc',
    username: 'catmom87',
    passwordHash: '$2a$10$T9V87qkQBawHREtMU6sudeD7JdxI/26y4RMsTY8oZS.oGJdztjAPq',
    name: 'Alice Smith',
    blogs: [],
    __v: 0
  }
]


module.exports = { dummyBlogs, dummyUsers }