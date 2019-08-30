const connection = require("../db/connection");

exports.selectArticleById = ({ article_id }) => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (article_id) query.where({ "articles.article_id": article_id });
    })
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Path not found" });
      } else {
        return article;
      }
    });
};

exports.editArticleById = ({ article_id }, { inc_votes }) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("articles")
      .where("article_id", article_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then(response => {
        if (!response.length) {
          return Promise.reject({ status: 404, msg: "Path not found" });
        } else {
          return response;
        }
      });
  }
};

exports.insertComment = ({ article_id }, patchObject) => {
  return connection("comments")
    .returning("*")
    .insert({
      author: patchObject.username,
      body: patchObject.body,
      article_id: article_id
    });
};

exports.selectComments = ({ article_id }) => {
  return connection("comments")
    .where("article_id", article_id)
    .returning("*");
};
