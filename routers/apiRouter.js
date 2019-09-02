const express = require("express");
const apiRouter = express.Router();
const { topicsRouter } = require("./topicsRouter.js");
const { usersRouter } = require("./usersRouter.js");
const { articlesRouter } = require("./articlesRouter.js");
const { commentsRouter } = require("./commentsRouter.js");
const { errorHandler405 } = require("../errors/index.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.route("/").all(errorHandler405);
module.exports = { apiRouter };
