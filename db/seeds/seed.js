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
      const formattedData = formatDates(articleData);
      return knex("articles")
        .insert(formattedData)
        .returning("*");

      /* 
          
          Your article data is currently in the incorrect format and will violate your SQL schema. 
          
          You will need to write and test the provided formatDate utility function to be able insert your article data.
    
          Your comment insertions will depend on information from the seeded articles, so make sure to return the data after it's been seeded.
          */
    })
    .then(articleRows => {
      const formattedDates = formatDates(commentData); //Formats the date for out comment data
      const createdLookup = makeRefObj(
        articleRows,
        commentData,
        "belongs_to",
        "article_id",
        "title"
      ); // creates a lookup object using both article rows and comment data, but - why the shit does the for each fail, and yet work? eh? eh? ehhhhh?
      const changeToAuthor = formatComments(
        formattedDates,
        "created_by",
        "author"
      );
      const formattedComments = formatComments(
        changeToAuthor,
        "belongs_to",
        "article_id",
        createdLookup
      );

      /* 
    
          Your comment data is currently in the incorrect format and will violate your SQL schema. 
    
          Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
          
          You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
          */

      // const articleRef = makeRefObj(articleRows);
      // const formattedComments = formatComments(commentData, articleRef);
      return knex("comments").insert(formattedComments);
    });
};
