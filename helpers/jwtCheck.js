const expressjwt = require("express-jwt");

const { JWT_SECRET } = process.env;

const jwtCheck = expressjwt({
  secret: JWT_SECRET
});

module.exports = jwtCheck;
