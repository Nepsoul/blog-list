const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const MyBlog = await Blog.find({}).populate("user", { username: 1, name: 1 }); //refactor using async/await
  response.json(MyBlog);
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
});

blogsRouter.get("/:id", async (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  console.log(body.userId);
  const user = await User.findById(body.userId);
  console.log(user);
  try {
    //for checking if like is not given
    if (body.likes === undefined) {
      body.likes = 0;
    }

    //for checking if title and url missing
    if (!(body.title || body.url)) {
      response.status(400).json({ error: "missing property" }).end();
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });
    const newBlog = await blog.save(); //refactor using async/await,try,catch
    user.blogs = user.blogs.concat(newBlog._id);
    await user.save();
    response.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }

  // blog
  //   .save()
  //   .then((savedblog) => {
  //     response.json(savedblog);
  //   })
  //   .catch((error) => next(error));
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }

  // .then(() => {
  //   response.status(204).end();
  // })
  // .catch((error) => next(error));
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const body = request.body;

    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    const updateBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      newBlog,
      {
        new: true,
      }
    );
    response.status(200).json(updateBlog);
    // Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    //   .then((updatedBlog) => {
    //     response.json(updatedBlog);
    //   })
    //   .catch((error) => next(error));
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
