exports.up = knex => {
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").primary();
    topicsTable.string("description").notNullable();
  });
};

exports.down = knex => {
  return knex.schema.dropTable("topics");
};
