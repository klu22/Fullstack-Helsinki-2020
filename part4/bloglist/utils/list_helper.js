const dummy = (blogList) => {
  return 1
}

const totalLikes = (blogList) => {
  return blogList
    .map(blog => blog.likes)
    .reduce((n, m) => n + m, 0) 
}

const favoriteBlog = (blogList) => {
  switch (blogList.length) {
    case 0: return null
    case 1: return blogList[0] 
    default: 
      return blogList.reduce(
        (blogA, blogB) => blogA.likes > blogB.likes ? blogA : blogB
      )
  }
}

/* Return a function which, given an object {k1: count_1, ..., kn: count_n},
  and a new item to consider, returns a new object of the same form and which 
  accounts for that item in some way specified by the user.
  Args:
    f is a fn determining the key for which to check.
    g is a fn determining the value to add.
*/
const createAccumulator = (f, g) => (counts, newItem) => {
  const key = f(newItem)
  const toAdd = g(newItem)
  const val = (key in counts) ? counts[key] + toAdd : toAdd
  return {
    ...counts,
    [key]: val
  }
}

const accumulateBlogsByAuthor = createAccumulator(
  blog => blog.author, 
  _ => 1
)

const accumulateLikesByAuthor = createAccumulator(
  blog => blog.author, 
  blog => blog.likes
)

/* Return a function which, given a list of blogs, runs them through an
accumulator and returns a new object {k, v} representing a maximal key-value
pair in the result.
  Args:
    accumulator is a function returned by createAccumulator, above.
    key_label is a string describing the key type in the counts (e.g. 'author')
    val_label is a string describing the value type in the counts (e.g. 'likes')
*/
const createMaxCountFinder = (accumulator, key_label, val_label) => 
  (blogList) => {
      if (blogList.length === 0) {return null}
      else {
        const counts = blogList.reduce(accumulator, {})
        const maximalKey = Object.keys(counts).reduce(
          (keyA, keyB) => counts[keyA] > counts[keyB] ? keyA : keyB
        )
        const maximalCount = counts[maximalKey]
        return {[key_label]: maximalKey, [val_label]: maximalCount}
      }
    }

const mostBlogs = createMaxCountFinder(accumulateBlogsByAuthor,'author','blogs')

const mostLikes = createMaxCountFinder(accumulateLikesByAuthor,'author','likes')

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}