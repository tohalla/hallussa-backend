import { Sql } from "knex";
import { ModelType } from "typegoose";
import { findIndex } from "../../mongoose";
import { AuditLog, AuditModel } from "../audit/audit";
import { ErrorLog, ErrorModel } from "../error/error";

interface Args {
  query?: string;
  reason?: Error;
}

const insert = async (mType: ModelType<AuditLog | ErrorLog>, args: Args) => {
  const index = await findIndex(mType);
  const model = new mType().getModelForClass(mType);
  const doc = new model({ ...args, index });
  await doc.save();
};

export const writeAuditLogEntry = async (query: string) => {
  await insert(AuditModel, { query });
};

export const writeErrorLogEntry = async (error: Error) => {
  await insert(ErrorModel, { reason: error });
};
