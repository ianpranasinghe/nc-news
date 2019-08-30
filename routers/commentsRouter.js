const express = require("express");
const commentsRouter = express.Router();

const {
  patchComment,
  deleteComment
} = require("../controllers/commentsController");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment);

module.exports = { commentsRouter };
