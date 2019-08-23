exports.up = knex => {
  console.log("CREATING - comments table... ");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.string("body").notNullable();
  });
};

exports.down = knex => {
  console.log("DROPPING - comments table... ");
};
