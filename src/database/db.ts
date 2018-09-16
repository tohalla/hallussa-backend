import Knex from "knex";
import { Model, QueryBuilder } from "objection";
import { writeAuditLogEntry, writeErrorLogEntry } from "./logger";

import { knex } from "../../knex";

Model.knex(Knex(knex));

export const query = async (queryBuilder: QueryBuilder<Model>) =>  {
  try {
    if (!queryBuilder.isFind()) { // should append to audit log if inserting / updating values to the db
      await writeAuditLogEntry(queryBuilder.toSql());
    }
    await queryBuilder; // if audit written succesfully, attempt to query db
  } catch (e) {
    // TODO: remove audit log entry if inserted
    await writeErrorLogEntry(e);
  }
};
