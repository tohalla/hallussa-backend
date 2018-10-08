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
  let index = 0;
  try {
    index = await findIndex(mType);
    const model = new mType().getModelForClass(mType);
    const doc = new model({ ...args, index });
    await doc.save();
  } catch (e) {
    throw e;
  }
};

export const writeAuditLogEntry = async (query: string) => {
  insert(AuditModel, { query });
  // let index = 0;
  // try {
  //   index = await findIndex(AuditModel);
  //   const model = new AuditModel({ query, index });
  //   await model.save();
  // } catch (e) {
  //   throw e;
  // }
};

export const writeErrorLogEntry = async (error: Error) => {
  insert(ErrorModel, { reason: error });
  // let index = 0;
  // try {
  //   index = await findIndex(ErrorModel);
  //   const model = new ErrorModel({ error, index });
  //   await model.save();
  // } catch (e) {
  //   throw e;
  // }
};
