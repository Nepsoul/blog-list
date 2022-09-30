const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const MyBlog = await Blog.find({}); //refactor using async/await
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
  });
  try {
    const newBlog = await blog.save(); //refactor using async/await,try,catch
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
  } catch (error) {
    next(error);
  }

  // .then(() => {
  //   response.status(204).end();
  // })
  // .catch((error) => next(error));
});

blogsRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
