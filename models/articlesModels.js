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
        return Promise.reject({ status: 404, msg: "Not Found" });
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
          return Promise.reject({ status: 404, msg: "Not Found" });
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

exports.selectComments = ({ article_id }, query) => {
  const sortQuery = query.sort_by;
  const orderQuery = query.order;
  if (
    query.hasOwnProperty("sort_by") ||
    query.hasOwnProperty("order") ||
    Object.keys(query).length === 0
  ) {
    return connection("comments")
      .where("article_id", article_id)
      .orderBy(sortQuery || "created_at", orderQuery || "desc")
      .returning("*");
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
};

exports.selectArticles = query => {
  const sortQuery = query.sort_by;
  const orderQuery = query.order;
  const authorQuery = query.author;
  const topicQuery = query.topic; // I didn't need to do this , can re-factor
  if (
    orderQuery !== "asc" &&
    orderQuery !== "desc" &&
    orderQuery !== undefined
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else if (
    query.hasOwnProperty("sort_by") ||
    query.hasOwnProperty("order") ||
    query.hasOwnProperty("author") ||
    query.hasOwnProperty("topic") ||
    Object.keys(query).length === 0
  ) {
    return connection("articles")
      .select("articles.*")
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .orderBy(sortQuery || "created_at", orderQuery || "desc")
      .groupBy("articles.article_id")
      .returning("*")
      .modify(query => {
        if (authorQuery) query.where({ "articles.author": authorQuery });
        if (topicQuery) query.where({ "articles.topic": topicQuery });
      })
      .then(response => {
        if (!response.length) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
          return response;
        }
      });
  }
};
