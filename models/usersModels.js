const connection = require("../db/connection");

exports.selectUserByUsername = ({ username }) => {
  return connection("users")
    .where("username", username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({ status: 404, msg: "Path not found" });
      } else {
        return user;
      }
    });
};
