import Knex from "knex";

exports.seed = async (knex: Knex) => {
  await knex("organisation").del();
  await knex("organisation_account").del();
  await knex("organisation").insert([
    {id: 1, name: "org1", organisationIdentifier: "123"},
    {id: 2, name: "org2", organisationIdentifier: "223"},
    {id: 3, name: "org3", organisationIdentifier: "323"},
  ]);
  await knex("organisation_account").insert([
    {organisation: 1, account: 1, isAdmin: true},
    {organisation: 2, account: 1, isAdmin: false},
  ]);
  await knex.raw(
    "SELECT pg_catalog.setval(pg_get_serial_sequence('organisation', 'id'), (SELECT MAX(id) FROM organisation)+1);"
  );
};
