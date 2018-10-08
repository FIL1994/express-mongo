require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const _ = require("lodash");

const CircularJSON = require("circular-json");
const chalk = require("chalk");

const posts = require("./routes/posts");
const users = require("./routes/users");
const auth = require("./routes/auth");

const { MONGO_URL } = process.env;

mongoose.connect(MONGO_URL);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// routes
app.use("/", auth);
app.use("/posts", posts);
app.use("/users", users);

app.get("/", (req, res) => {
  res.send("Hello!");
});

const server = app.listen(3000, () => {
  console.log(
    chalk.green(`Server running at http://localhost:${server.address().port}`)
  );
});
