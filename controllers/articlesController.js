const {
  selectArticleById,
  editArticleById,
  insertComment,
  selectComments,
  selectArticles
} = require("../models/articlesModels.js");

exports.getArticleById = (req, res, next) => {
  const articleID = req.params;
  selectArticleById(articleID)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const articleID = req.params;
  const patchObject = req.body;
  editArticleById(articleID, patchObject)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const articleID = req.params;
  const postBody = req.body;
  insertComment(articleID, postBody)
    .then(response => {
      const comment = response[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const article_id = req.params;
  const query = req.query;

  selectComments(article_id, query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  selectArticles(query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
