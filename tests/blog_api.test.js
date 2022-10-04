const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

const Blog = require("../models/blog");
const { response } = require("../app");

// const initialBlogs = [
//   {
// title: "hackers arise",
// author: "liquid",
// url: "url",
// likes: 50,
//   },
//   {
//     title: "winter",
//     author: "zoel",
//     url: "url",
//     likes: 62,
//   },
// ];

beforeEach(async () => {
  try {
    await Blog.deleteMany({});
    let blogObject = new Blog(helper.initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(helper.initialBlogs[1]);
    await blogObject.save();
  } catch (error) {
    next(error);
  }
});

test("notes are returned as json", async () => {
  //this func is used for checking whether note is returned as json or not.
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/); //regular expression
});

test("all notes are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/blogs");

  const blogs = response.body.map((r) => r.title);
  expect(blogs).toContain("hackers arise");
});

test("a valid note can be added", async () => {
  //using post method to test
  const newBlog = {
    title: "shoes",
    author: "paul",
    url: "url",
    likes: 54,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const blogs = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  expect(blogs).toContain("hackers arise");
});

test("verifying blog post by unique id by database _id", async () => {
  //for verifying _id in id key
  const response = await api.get("/api/blogs");
  //console.log("iam response", response.body[0].id);
  expect(response.body[0].id).toBeDefined();
});

test("verifying if like property missing from request", async () => {
  const newBlog = {
    title: "heroku",
    author: "serizawa",
    url: "url.com",
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");
  const missingLikes = response.body.map((r) => r.likes);
  //console.log("missing", missingLikes);
  expect(missingLikes).toContain(0);
});

test("throwing an error, if title and url property missing", async () => {
  const newBlog = {
    author: "kanxi",
    likes: 409,
  };
  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("deleting single blog post", async () => {
  const deleteBlog = await Blog.find({ title: "hackers arise" });
  //console.log("line 115", deleteBlog);
  await api.delete(`/api/blogs/${deleteBlog[0]._id}`).expect(204);
  const remainedBlog = await Blog.find({});
  //console.log("iam remained", remainedBlog);
  const blogTitle = remainedBlog.map((r) => {
    return r.title;
  });
  expect(blogTitle).not.toContain("hackers arise");
});

test("updating the likes of blog", async () => {
  const updateBlog = await Blog.find({ title: "hackers arise" });

  const updatedLike = {
    likes: 100,
  };
  await api.put(`/api/blogs/${updateBlog[0].id}`).send(updatedLike).expect(200);
  const newLike = await Blog.find({ title: "hackers arise" });
  expect(newLike[0].likes).toBe(100);
});

afterAll(() => {
  mongoose.connection.close();
});
