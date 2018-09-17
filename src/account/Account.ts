import bcrypt from "bcryptjs";
import { Model, ModelOptions } from "objection";

export default class Account extends Model {
  public static tableName = "account";

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      firstName: {type: "string", minLength: 1, maxLength: 255},
      lastName: {type: "string", minLength: 1, maxLength: 255},
      password: {type: "string", minLength: 6},
      // validation of the email address is done at the client side, after which the confirmation email is sent
    },
    required: ["firstName", "lastName", "password", "email"],
  };

  public id?: number;
  public password?: string;
  public email?: string;
  public updatedAt?: string;
  public createdAt?: Date;

  public async $beforeInsert() {
    this.password = await hashPassword(this.password as string); // password required and validated by json schema
  }

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field
    delete this.email; // TODO: send email confirmation if email update was requested

    if (this.password)  {
      this.password = await hashPassword(this.password);
    }
    this.updatedAt = new Date().toISOString();
  }

  public async $afterInsert() {
    // TODO: send email confirmation
  }
}

// hash and salt plain text password
const hashPassword = async (password: string): Promise<string> => bcrypt.hash(
  password || "", // objection validates according to provided json schema
  await bcrypt.genSalt(10)
);
