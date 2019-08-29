const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  patchArticleById,
  postComment
} = require("../controllers/articlesController");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter.route("/:article_id/comments").post(postComment);

module.exports = { articlesRouter };
