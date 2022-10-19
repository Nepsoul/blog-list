const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

const Blog = require("../models/blog");
const { response } = require("../app");

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

describe("test to be tested", () => {
  let token;
  beforeEach(async () => {
    const newUser = {
      username: "groot",
      name: "root",
      password: "password",
    };
    let response = await api.post("/api/users").send(newUser);
    const result = await api.post("/api/login").send(newUser);
    //console.log(response);
    // console.log(result.body.token);

    token = {
      Authorization: `bearer ${result.body.token}`,
    };
  });
  test("blogs are returned as json", async () => {
    //this func is used for checking whether note is returned as json or not.
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/); //regular expression
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const blogs = response.body.map((r) => r.title);
    expect(blogs).toContain("hackers arise");
  });

  test("a valid blog can be added", async () => {
    //using post method to test
    const newBlog = {
      title: "shoes",
      author: "paul",
      url: "url",
      likes: 54,
      userId: "634539bd1a38ad7274f2f585",
    };
    console.log(token);
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set(token)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const blogs = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    console.log(blogs);
    expect(blogs).toContain("shoes");
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
      userId: "634539bd1a38ad7274f2f585",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set(token)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const missingLikes = response.body.map((r) => r.likes);

    expect(missingLikes).toContain(0);
  });

  test("throwing an error, if title and url property missing", async () => {
    const newBlog = {
      author: "kanxi",
      likes: 409,
    };
    await api.post("/api/blogs").send(newBlog).set(token).expect(400);
  });

  test("deleting single blog post", async () => {
    const deleteBlog = await Blog.find({ title: "hackers arise" });

    await api.delete(`/api/blogs/${deleteBlog[0]._id}`).set(token).expect(204);
    const remainedBlog = await Blog.find({});

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
    await api
      .put(`/api/blogs/${updateBlog[0].id}`)
      .send(updatedLike)
      .set(token)
      .expect(200);
    const newLike = await Blog.find({ title: "hackers arise" });
    expect(newLike[0].likes).toBe(100);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
