const express = require("express");
const _ = require("lodash");
const HttpStatus = require("http-status-codes");

const jwtCheck = require("../middleware/jwtCheck");
const { User } = require("../models/User");

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

router.delete("/:id", jwtCheck, (req, res, next) => {
  res.status(HttpStatus.NOT_IMPLEMENTED).send({
    error: HttpStatus.getStatusText(HttpStatus.NOT_IMPLEMENTED)
  });

  // User.findById(req.params.id).remove().exec();
});

module.exports = router;
