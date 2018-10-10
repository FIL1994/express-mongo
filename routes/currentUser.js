const express = require("express");
const _ = require("lodash");

const { getUser } = require("../helpers/getUser");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const user = await getUser(req);

  if (_.isError(user)) {
    next(user);
    return;
  }

  res.send(user);
});

module.exports = router;
