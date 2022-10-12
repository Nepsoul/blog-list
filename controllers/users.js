const bcryptjs = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  try {
    if (username.length < 3 || password.length < 3) {
      return response
        .status(400)
        .send("username and password must be at least 3 characters long");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(400).json({
        error: "username must be unique",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    return response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  return response.json(users);
});

module.exports = usersRouter;
