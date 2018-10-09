import { pre, prop, Typegoose } from "typegoose";

// On insert
@pre<ErrorLog>("save", function(next) {
  const timestamp = Date.now();
  if (!this.timestamp) {
    this.timestamp = timestamp;
  }
  next();
})

// Schema
export class ErrorLog extends Typegoose {
  @prop({ required: true })
  public timestamp: number;
  @prop({ required: true })
  public reason: Error;
}

export const ErrorModel = new ErrorLog().getModelForClass(ErrorLog);
