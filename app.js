const express = require("express");
const cors = require("cors");
const middleware = require("./utils/middleware");

const blogsRouter = require("./controllers/blogs");
const App = express();

//App.use..... is middleware
App.use(cors());
App.use(express.json());
// App.use(express.json());==> if this place at below the app.use give 'undefined', always place at above the code

App.use(middleware.requestLogger); //middleware imported through middleware.js file

App.use("/blogs", blogsRouter); //calling blogs api via notesRouter

App.use(middleware.unknownEndpoint); //no route found, error through this middleware

App.use(middleware.errorHandler);
//this has to be last loaded middleware

module.exports = App;
