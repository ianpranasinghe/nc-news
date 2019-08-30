const { editComment, removeComment } = require("../models/commentsModels.js");

exports.patchComment = (req, res, next) => {
  const commentID = req.params;
  const patchObject = req.body;
  editComment(commentID, patchObject)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const commentID = req.params;
  removeComment(commentID)
    .then(comment => {
      res.status(204).send({ comment });
    })
    .catch(next);
};
