const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

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

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
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

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/blogs");

  const blogs = response.body.map((r) => r.title);
  expect(blogs).toContain("shoes");
});

afterAll(() => {
  mongoose.connection.close();
});
