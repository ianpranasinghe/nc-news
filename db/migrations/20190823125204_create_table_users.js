exports.up = knex => {
  console.log("CREATING - users table... ");
  return knex.schema.createTable("users", usersTable => {
    usersTable.string("username").primary();
    usersTable.string("avatar_url").notNullable();
    usersTable.string("name").notNullable();
  });
};

exports.down = knex => {
  console.log("DROPPING - users table... ");
  return knex.schema.dropTable("users");
};
