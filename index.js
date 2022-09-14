const app = require("./app"); // the actual Express application
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");

const server = http.createServer(app); //creating http server

// //if port has given as variable in process.env then use given port otherwise use default port
// const PORT = process.env.PORT || "3003";

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
