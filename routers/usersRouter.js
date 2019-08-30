const express = require("express");
const usersRouter = express.Router();
const { getUserByUsername } = require("../controllers/usersController");
const { errorHandler405 } = require("../errors/index.js");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(errorHandler405);

module.exports = { usersRouter };
