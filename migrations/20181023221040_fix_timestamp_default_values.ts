import Knex from "knex";

exports.up = (knex: Knex) => Promise.all([
  knex.raw(`ALTER TABLE appliance ALTER COLUMN created_at SET DEFAULT now()`),
  knex.raw(`ALTER TABLE maintainer ALTER COLUMN created_at SET DEFAULT now()`),
  knex.raw(`ALTER TABLE account ALTER COLUMN created_at SET DEFAULT now()`),
  knex.raw(`ALTER TABLE manufacturer ALTER COLUMN created_at SET DEFAULT now()`),
  knex.raw(`ALTER TABLE maintenance_event ALTER COLUMN created_at SET DEFAULT now()`),
  knex.raw(`ALTER TABLE model ALTER COLUMN created_at SET DEFAULT now()`),
]);

exports.down = (knex: Knex) => Promise.resolve(true);
