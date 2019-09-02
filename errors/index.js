exports.errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.errorHandler400s = (err, req, res, next) => {
  const codes = ["22P02", "23502", "42703"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "User does not exist" });
  } else {
    next(err);
  }
};

exports.errorHandler405 = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.errorHandler500s = (err, req, res, next) => {
  console.log(err, "<--- error ");
  res.status(500).send({ msg: "Internal Server Error" });
};
