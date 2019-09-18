const { selectUserByUsername } = require("../models/usersModels");
const { selectUsers } = require("../models/usersModels");

exports.getUserByUsername = (req, res, next) => {
  const username = req.params;
  selectUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
exports.getUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};
