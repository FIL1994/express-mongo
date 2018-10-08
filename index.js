require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const expressjwt = require("express-jwt");
const HttpStatus = require("http-status-codes");
const _ = require("lodash");

const CircularJSON = require("circular-json");
const chalk = require("chalk");

const { getUser, getUserID } = require("./helpers/getUser");
const { User } = require("./models/User");
const { Post } = require("./models/Post");

const { MONGO_URL, JWT_SECRET } = process.env;

mongoose.connect(MONGO_URL);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const jwtCheck = expressjwt({
  secret: JWT_SECRET
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/users", (req, res, next) => {
  User.find((err, doc) => {
    if (err) {
      next(err);
      return;
    }

    res.send(doc);
  });
});

app.get("/users", (req, res, next) => {
  User.find((err, doc) => {
    if (err) {
      next(err);
      return;
    }

    res.send(doc);
  });
});

app.get("/users/:id", (req, res, next) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) {
      next(err);
      return;
    }

    res.send(doc);
  });
});

app.delete("/users/:id", jwtCheck, (req, res, next) => {
  res.status(HttpStatus.NOT_IMPLEMENTED).send({
    error: HttpStatus.getStatusText(HttpStatus.NOT_IMPLEMENTED)
  });

  // User.findById(req.params.id).remove().exec();
});

app.get("/posts", jwtCheck, async (req, res, next) => {
  const posts = await Post.find().catch(e => e);

  if(_.isError(posts)) {
    next(posts.message);
  }

  res.send(posts);
});

app.post("/posts", jwtCheck, async (req, res, next) => {
  const userID = getUserID(req);
  if (_.isError(userID)) {
    next(userID);
    return;
  }

  const postData = req.body;
  const post = await Post.create({
    author: userID,
    ...postData
  }).catch(e => e);

  if (_.isError(post)) {
    next(post.message);
    return;
  }

  post.save();
  res.send(post);
});

app.post("/signup", async (req, res, next) => {
  const userData = req.body;

  const user = await User.create(userData).catch(e => e);

  if (_.isError(user)) {
    next(user);
    return;
  }

  user.save();
  res.send(user);
});

app.post("/login", async (req, res) => {
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
      access_token: token
    });
  }
});

const server = app.listen(3000, () => {
  console.log(
    chalk.green(`Server running at http://localhost:${server.address().port}`)
  );
});
