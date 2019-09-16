const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  errorHandler,
  errorHandler400s,
  errorHandler405,
  errorHandler500s
} = require("./errors/index.js");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(errorHandler);
app.use(errorHandler400s);
app.use(errorHandler500s);
app.use(errorHandler405);

module.exports = app;
