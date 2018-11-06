import Knex from "knex";

exports.seed = async (knex: Knex) => {
  await knex("appliance").del();
  await knex("appliance").insert([
    {id: 1, name: "appliance1"},
    {id: 2, name: "appliance2"},
    {id: 3, name: "appliance3"},
  ]);
};
