import { config } from "dotenv";
import mongoose from "mongoose";
import { ModelType } from "typegoose";

import { AuditLog } from "./src/audit/audit";
import { ErrorLog } from "./src/error/error";

config({path: ".env"});

if (!(
    process.env.MONGODB_USER &&
    process.env.MONGODB_PASS &&
    process.env.MONGODB_INITDB_ROOT_USERNAME &&
    process.env.MONGODB_INITDB_ROOT_PASSWORD &&
    process.env.MONGODB_URL
  )) {
  throw new Error("define environment variables for mongodb.");
}

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/", { useNewUrlParser: true });

// Return next available index for document to be inserted
export const findIndex = async (model: ModelType<AuditLog | ErrorLog>) => {
  try {
    const doc = await model.findOne({ }, "index", { $orderby: { index: -1 } });
    if (!doc || !doc.index) {
      return 0;
    }
    return doc.index + 1;
  } catch (e) {
    throw e;
  }
};
