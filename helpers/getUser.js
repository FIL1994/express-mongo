const jwt = require("jsonwebtoken");

const { User } = require("../models/User");

const { JWT_SECRET } = process.env;

const getUser = async req => {
  const userID = getUserID(req);
  const user = await User.findById(userID).catch(e => e);

  return user;
};

const getUserID = req => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userTokenData = jwt.verify(token, JWT_SECRET);

    return userTokenData.id;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getUser,
  getUserID
};
