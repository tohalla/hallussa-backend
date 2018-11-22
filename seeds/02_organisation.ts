import Knex from "knex";

exports.seed = async (knex: Knex) => {
  await knex("organisation").del();
  await knex("organisation_account").del();
  await knex("organisation").insert([
    {id: 1, name: "Washin Machin Oy", organisationIdentifier: "123"},
    {id: 2, name: "Event Organisers Oy", organisationIdentifier: "223"},
    {id: 3, name: "Soda Machine Oy", organisationIdentifier: "323"},
    {id: 4, name: "Helsinki Appliances Oy", organisationIdentifier: "432"},
    {id: 5, name: "Large Industrial Appliances Oy", organisationIdentifier: "555"},
    {id: 6, name: "Print-IT Oy", organisationIdentifier: "656"},
  ]);
  await knex("organisation_account").insert([
    {organisation: 1, account: 1, isAdmin: true},
    {organisation: 2, account: 1, isAdmin: true},
    {organisation: 3, account: 1, isAdmin: true},
    {organisation: 4, account: 1, isAdmin: true},
    {organisation: 5, account: 1, isAdmin: true},
    {organisation: 6, account: 1, isAdmin: true},
    {organisation: 4, account: 2, isAdmin: true},
    {organisation: 5, account: 3, isAdmin: true},
    {organisation: 2, account: 4, isAdmin: true},
    {organisation: 6, account: 3, isAdmin: false},
  ]);
  await knex.raw(
    "SELECT pg_catalog.setval(pg_get_serial_sequence('organisation', 'id'), (SELECT MAX(id) FROM organisation)+1);"
  );
};
