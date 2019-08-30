const express = require("express");
const topicsRouter = express.Router();
const { getTopics } = require("../controllers/topicsController");
const { errorHandler405 } = require("../errors/index.js");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(errorHandler405);

module.exports = { topicsRouter };
