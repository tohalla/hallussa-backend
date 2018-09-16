import bcrypt from "bcryptjs";
import { Model } from "objection";

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

  public password?: string;
  public updatedAt?: string;

  public async $beforeInsert() {
    // hash and salt plain text password
    this.password = await bcrypt.hash(
      this.password || "", // objection validates according to provided json schema
      await bcrypt.genSalt(10)
    );
  }

  public async $afterInsert() {
    // TODO: send email confirmation
  }

  public $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
