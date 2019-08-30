const express = require("express");
const commentsRouter = express.Router();
const { errorHandler405 } = require("../errors/index.js");

const {
  patchComment,
  deleteComment
} = require("../controllers/commentsController");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(errorHandler405);

module.exports = { commentsRouter };
