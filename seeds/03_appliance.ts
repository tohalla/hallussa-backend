import Knex from "knex";

exports.seed = async (knex: Knex) => {
  await knex("appliance").del();
  await knex("appliance").insert([
    {id: 1, name: "appliance1", organisation: 1},
    {id: 2, name: "appliance2", organisation: 1},
    {id: 3, name: "appliance3", organisation: 2},
    {id: 4, name: "appliance4", organisation: 3},
  ]);
  await knex.raw(
    "SELECT pg_catalog.setval(pg_get_serial_sequence('appliance', 'id'), (SELECT MAX(id) FROM appliance)+1);"
  );
};
