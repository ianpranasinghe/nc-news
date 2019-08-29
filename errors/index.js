exports.errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.errorHandler400s = (err, req, res, next) => {
  const codes = ["22P02"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.errorHandler500s = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
