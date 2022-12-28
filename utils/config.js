require("dotenv").config();

//handling env variable extracted from seperate file
const PORT = process.env.PORT; //port defining in env to 3003
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
