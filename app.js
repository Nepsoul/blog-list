const express = require("express");
const cors = require("cors");
const middleware = require("./utils/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users"); //creating users router
const loginRouter = require("./controllers/login");
const App = express();
App.use(express.static("build"));

//App.use..... is middleware
App.use(cors());
App.use(express.json());
// App.use(express.json());==> if this place at below the app.use give 'undefined', always place at above the code

App.use(middleware.requestLogger); //middleware imported through middleware.js file
App.use(middleware.tokenExtractor); //register the middleware for refactor token
App.use(middleware.userExtractor); //register the middleware for refactor token

App.use("/api/blogs", blogsRouter); //calling blogs api via notesRouter
App.use("/api/users", usersRouter); //for userRouter
App.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testingRouter");
  App.use("/api/testingRouter", testingRouter);
}

App.use(middleware.unknownEndpoint); //no route found, error through this middleware
App.use(middleware.errorHandler);
//this has to be last loaded middleware

module.exports = App;
