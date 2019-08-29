const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = knex => {
  const topicsInsertions = knex("topics")
    .insert(topicData)
    .returning("*");
  const usersInsertions = knex("users")
    .insert(userData)
    .returning("*");

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => Promise.all([topicsInsertions, usersInsertions]))
    .then(() => {
      const formattedData = formatDates(articleData); // Formats the dates inside our Articles Data
      return knex("articles")
        .insert(formattedData)
        .returning("*");
    })
    .then(articleRows => {
      const formattedDates = formatDates(commentData); //Formats the date for out Comment Data
      const createdLookup = makeRefObj(
        articleRows,
        commentData,
        "belongs_to",
        "article_id",
        "title"
      ); // creates a lookup object using both article rows and comment data
      const changeToAuthor = formatComments(
        formattedDates,
        "created_by",
        "author"
      ); // Changes the created_by key name to author
      const formattedComments = formatComments(
        changeToAuthor,
        "belongs_to",
        "article_id",
        createdLookup
      ); // Changes the belongs_to key name tp article_id and changes the value to the correct id.
      return knex("comments").insert(formattedComments);
    });
};
