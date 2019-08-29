const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  errorHandler,
  errorHandler400s,
  errorHandler500s
} = require("./errors/index.js");
// ASK HOW TO SORT OUT ERRORS, WHATS SERVER AND WHATS USER AND BLA BLA BLA
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  // next({status: 3456789})
  res.status(404).send({ msg: "Path not found" });
});

app.use(errorHandler);
app.use(errorHandler400s);
app.use(errorHandler500s);

module.exports = app;
