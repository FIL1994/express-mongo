const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const expressjwt = require("express-jwt");

const app = express();
const PORT = 3000;
const jwtSecretKey = "my_super_secret_key";
const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "guest", password: "guest" }
];

app.use(bodyParser.json());
app.use(cors());

const jwtCheck = expressjwt({
  secret: jwtSecretKey
});

app.get("/resource", (req, res) => {
  res.status(200).send("Public resource, you can see this");
});

app.get("/resource/secret", jwtCheck, (req, res) => {
  res.status(200).send("Secret resource, you should be logged in to see this");
});

app.get("/status", (req, res) => {
  const localTime = new Date().toLocaleTimeString();

  res.status(200).send(`Server time is ${localTime}`);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("You need a username and password");
    return;
  }

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    res.status(401).send("User not found");
    return;
  }

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
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${server.address().port}`);
});
