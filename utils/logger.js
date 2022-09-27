const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    //console is only call when node env in not test
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

module.exports = {
  info,
  error,
};
