const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  patchArticleById,
  postComment,
  getComments,
  getArticles
} = require("../controllers/articlesController");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = { articlesRouter };
