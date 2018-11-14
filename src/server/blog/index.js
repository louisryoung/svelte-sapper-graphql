import { blogModel } from '../../models/blog'
import { filterBlog } from './filter'
import { getUsers } from './users'

const blog = (req, res) => {
  blogModel
    .find()
    .exec()
    .then(async blogs => {
      blogs = JSON.parse(JSON.stringify(blogs))

      // retrieve the users whom authored a blog
      let users = await getUsers(blogs.map(f => f.userId))

      // add user info to each blog then filter it to remove unwanted fields
      return res.status(200).json({
        blogs: blogs.map( blog => filterBlog(blog, users.find( user => blog.userId == user._id)))
      })
    })
    .catch(error => {
      res.status(500).json({
        error: error,
      })
    })
}

export default blog
