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
const log = console.log;

const { Person } = require("./models/Person");
const { User } = require("./models/User");

const url = process.env.MONGO_URL;
const jwtSecretKey = process.env.JWT_SECRET;

mongoose.connect(url);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const jwtCheck = expressjwt({
  secret: jwtSecretKey
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/people", jwtCheck, (req, res) => {
  const personData = new Person(req.body);

  const person = personData.save().catch(e => e);

  if (_.isError(person)) {
    next(person);
    return;
  }

  res.send(personData);
});

app.get("/people/first", (req, res, next) => {
  Person.find()
    .select("firstName")
    .exec((err, doc) => {
      if (err) {
        next(err);
        return;
      }

      res.send(doc);
    });
});

app.get("/people/:id", (req, res, next) => {
  Person.findById(req.params.id, (err, doc) => {
    if (err) {
      next(err);
      return;
    }

    res.send(doc);
  });
});

app.get("/people", (req, res, next) => {
  Person.find((err, doc) => {
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

app.get("/users", (req, res, next) => {
  User.find((err, doc) => {
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
        sub: user.id,
        user: user.username
      },
      jwtSecretKey,
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
  log(
    chalk.green(`Server running at http://localhost:${server.address().port}`)
  );
});
