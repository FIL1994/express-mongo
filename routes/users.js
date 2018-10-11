const express = require("express");
const _ = require("lodash");
const HttpStatus = require("http-status-codes");

const jwtCheck = require("../middleware/jwtCheck");
const { User } = require("../models/User");
const { getUser } = require("../helpers/getUser");

const router = express.Router();

router.get("/", jwtCheck, (req, res, next) => {
  User.find()
    .select("username")
    .lean({ virtuals: false })
    .exec((err, doc) => {
      if (err) {
        next(err);
        return;
      }

      res.send(doc);
    });
});

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) {
      next(err);
      return;
    }

    res.send(doc);
  });
});

router.delete("/:id", jwtCheck, async (req, res, next) => {
  // res
  //   .status(HttpStatus.NOT_IMPLEMENTED)
  //   .json(HttpStatus.getStatusText(HttpStatus.NOT_IMPLEMENTED));

  const user = await getUser(req);

  if (!user.isAdmin) {
    res
      .status(HttpStatus.FORBIDDEN)
      .json(HttpStatus.getStatusText(HttpStatus.FORBIDDEN));
    return;
  }

  try {
    await User.findById(req.params.id)
      .remove()
      .exec();
  } catch (err) {
    next(err);
    return;
  }
  res.send("deleted user");
});

module.exports = router;
