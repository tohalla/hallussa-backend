import Knex from "knex";

exports.up = (knex: Knex) =>
  knex.raw(`
    ALTER TABLE organisation_account
      DROP CONSTRAINT organisation_account_user_role_foreign,
      ADD CONSTRAINT organisation_account_user_role_foreign
        FOREIGN KEY (user_role) REFERENCES user_role(id) ON DELETE SET NULL;
    ALTER TABLE organisation_account ALTER COLUMN user_role DROP NOT NULL;
  `);

exports.down = (knex: Knex) =>
  knex.raw(`
    ALTER TABLE organisation_account
      DROP CONSTRAINT organisation_account_user_role_foreign,
      ADD CONSTRAINT organisation_account_user_role_foreign
        FOREIGN KEY (user_role) REFERENCES user_role(id) ON DELETE CASCADE;
    ALTER TABLE organisation_account ALTER COLUMN user_role SET NOT NULL;
  `);
