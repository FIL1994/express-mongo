const cacheControlMiddleware = require("express-cache-controller");

const jwtCheck = require("./jwtCheck");

const cacheControl = (maxAge = 60) => {
  return cacheControlMiddleware({
    maxAge
  });
};

module.exports = {
  jwtCheck,
  cacheControl
};
