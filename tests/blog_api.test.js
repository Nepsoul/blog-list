const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

const Blog = require("../models/blog");
const { response } = require("../app");

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

afterAll(() => {
  mongoose.connection.close();
});
