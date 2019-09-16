const connection = require("../db/connection");

exports.editComment = ({ comment_id }, { inc_votes }) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("comments")
      .where("comment_id", comment_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then(response => {
        if (!response.length) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
          return response[0];
        }
      });
  }
};

exports.removeComment = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(deleteCount => {
      if (deleteCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      } else {
        return deleteCount;
      }
    });
};
