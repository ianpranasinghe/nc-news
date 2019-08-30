const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  patchArticleById,
  postComment,
  getComments,
  getArticles
} = require("../controllers/articlesController");
const { errorHandler405 } = require("../errors/index.js");
articlesRouter
  .route("/")
  .get(getArticles)
  .all(errorHandler405);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(errorHandler405);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment)
  .all(errorHandler405);

module.exports = { articlesRouter };
