const {
  selectArticleById,
  editArticleById,
  insertComment
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
    .then(patchedArticle => {
      res.status(200).send({ patchedArticle });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const articleID = req.params;
  const postBody = req.body;
  insertComment(articleID, postBody)
    .then(postedResponse => {
      res.status(201).send({ postedResponse });
    })
    .catch(next);
};
