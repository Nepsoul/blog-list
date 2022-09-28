const Blog = require("../models/blog"); //for use of Blog model imported blog

const initialBlogs = [
  {
    title: "shoes",
    author: "paul",
    url: "url",
    likes: 54,
  },
  {
    title: "winter",
    author: "zoel",
    url: "url",
    likes: 62,
  },
];

const nonExistingId = async () => {
  //this func create unique ID
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

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
