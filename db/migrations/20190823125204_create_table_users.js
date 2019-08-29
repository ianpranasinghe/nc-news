exports.up = knex => {
  return knex.schema.createTable("users", usersTable => {
    usersTable.string("username").primary();
    usersTable.string("avatar_url").notNullable();
    usersTable.string("name").notNullable();
  });
};

exports.down = knex => {
  return knex.schema.dropTable("users");
};
