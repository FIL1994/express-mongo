const express = require("express");
const _ = require("lodash");

const { getUserID } = require("../helpers/getUser");
const { jwtCheck, cacheControl } = require("../middleware");
const Note = require("../models/Note");

const router = express.Router();

router.get("/", jwtCheck, cacheControl(10 * 60), async (req, res, next) => {
  const author = getUserID(req);
  const notes = await Note.find({ author }).catch(e => e);

  if (_.isError(notes)) {
    next(notes.message);
  }

  res.send(notes);
});

router.post("/", jwtCheck, async (req, res, next) => {
  const userID = getUserID(req);
  if (_.isError(userID)) {
    next(userID);
    return;
  }

  const noteData = req.body;
  const note = await Note.create({
    author: userID,
    ...noteData
  }).catch(e => e);

  if (_.isError(note)) {
    next(note.message);
    return;
  }

  note.save();
  res.send(note);
});

module.exports = router;
