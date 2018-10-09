import { Sql } from "knex";
import { ModelType } from "typegoose";
import { AuditLog, AuditModel } from "../audit/audit";
import { ErrorLog, ErrorModel } from "../error/error";

interface Args {
  query?: string;
  reason?: Error;
}

const insert = async (mType: ModelType<AuditLog | ErrorLog>, args: Args) => {
  const model = new mType().getModelForClass(mType);
  const doc = new model({ ...args });
  await doc.save();
};

export const writeAuditLogEntry = async (query: string) => {
  await insert(AuditModel, { query });
};

export const writeErrorLogEntry = async (error: Error) => {
  await insert(ErrorModel, { reason: error });
};
