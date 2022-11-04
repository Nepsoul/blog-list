const Blog = require("../models/blog"); //for use of Blog model imported blog
const User = require("../models/user");

const initialBlogs = [
  {
    title: "hackers arise",
    author: "liquid",
    url: "url",
    likes: 50,
    user: "63556abc8a17897bf6680fab",
  },
  {
    title: "winter",
    author: "zoel",
    url: "url",
    likes: 62,
    user: "63556abc8a17897bf6680fab",
  },
];

const nonExistingId = async () => {
  //only for checking, this func create new blog and removed, which processed on other block.
  const blog = new Blog({
    title: "willremovethissoon",
    author: "ramen",
    url: "url",
    likes: 76,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  //this func check note stored in database
  const blogs = await Blog.find({}); //Blog model used
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
