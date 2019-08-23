exports.up = knex => {
  console.log("CREATING - topics table... ");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").primary();
    topicsTable.string("description").notNullable();
  });
};

exports.down = knex => {
  console.log("DROPPING - topics table... ");
  return knex.schema.dropTable("topics");
};
