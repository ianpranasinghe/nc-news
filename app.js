const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const { errorHandler400s } = require("./errors/index.js");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  // next({status: 3456789})
  res.status(404).send({ msg: "Path not found" });
});

app.use(errorHandler400s);

module.exports = app;
