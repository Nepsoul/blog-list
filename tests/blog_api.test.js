const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

const Blog = require("../models/blog");

// const initialBlogs = [
//   {
//     title: "shoes",
//     author: "paul",
//     url: "url",
//     likes: 54,
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
  expect(blogs).toContain("shoes");
});

test("a valid note can be added", async () => {
  //using post method to test
  const newBlog = {
    title: "hackers arise",
    author: "liquid",
    url: "url",
    likes: 505,
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

afterAll(() => {
  mongoose.connection.close();
});
