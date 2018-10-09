import { pre, prop, Typegoose } from "typegoose";

// On insert
@pre<AuditLog>("save", function(next) {
  const timestamp = Date.now();
  if (!this.timestamp) {
    this.timestamp = timestamp;
  }
  next();
})

// Schema
export class AuditLog extends Typegoose {
  @prop({ required: true })
  public query: string;
  @prop({ required: true })
  public timestamp: number;
}

export const AuditModel = new AuditLog().getModelForClass(AuditLog);
