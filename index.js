require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const _ = require("lodash");

const CircularJSON = require("circular-json");
const chalk = require("chalk");

const auth = require("./routes/auth");
const users = require("./routes/users");
const currentUser = require("./routes/currentUser");
const posts = require("./routes/posts");
const notes = require("./routes/notes");

const { MONGO_URL } = process.env;

mongoose.connect(MONGO_URL);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// routes
app.use("/", auth);
app.use("/users", users);
app.use("/current-user", currentUser);
app.use("/posts", posts);
app.use("/notes", notes);

app.get("/", (req, res) => {
  res.send("Hello!");
});

const server = app.listen(3000, () => {
  console.log(
    chalk.green(`Server running at http://localhost:${server.address().port}`)
  );
});
