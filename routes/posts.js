const express = require("express");
const _ = require("lodash");

const { getUserID } = require("../helpers/getUser");
const { jwtCheck, cacheControl } = require("../middleware");
const { Post } = require("../models/Post");

const router = express.Router();

router.get("/", jwtCheck, cacheControl(), async (req, res, next) => {
  const posts = await Post.find().catch(e => e);

  if (_.isError(posts)) {
    next(posts.message);
  }

  res.send(posts);
});

router.post("/", jwtCheck, async (req, res, next) => {
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

module.exports = router;
