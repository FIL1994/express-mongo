const express = require("express");
const _ = require("lodash");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");

const { User } = require("../models/User");

const router = express.Router();
const { JWT_SECRET } = process.env;

router.post("/signup", async (req, res, next) => {
  const userData = req.body;
  userData.isAdmin = false;

  const user = await User.create(userData).catch(e => e);

  if (_.isError(user)) {
    next(user);
    return;
  }

  user.save();
  res.send(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(HttpStatus.BAD_REQUEST).send("You need a username and password");
    return;
  }

  const user = await User.findOne({ username, password }).catch(err => err);

  if (!user) {
    res.status(HttpStatus.UNAUTHORIZED).send("Invalid credentials");
    return;
  } else {
    const token = jwt.sign(
      {
        id: user.id,
        user: user.username
      },
      JWT_SECRET,
      {
        expiresIn: "3 hours"
      }
    );

    res.status(200).send({
      access_token: token,
      user
    });
  }
});

module.exports = router;
