import bcrypt from "bcryptjs";
import { lowerCase, titleCase } from "change-case";
import { Model, Pojo, snakeCaseMappers } from "objection";
import { evolve, map, omit } from "ramda";

import OrganisationAccount from "../../relation-models/OrganisationAccount";

export default class Account extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "account";

  public static relationMappings = {
    organisations: { // should never eagerly load organisations, only ID's
      join: {
        from: "account.id",
        to: "organisation_account.account",
      },
      modelClass: OrganisationAccount,
      relation: Model.HasManyRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      firstName: {type: "string", minLength: 1, maxLength: 64},
      lastName: {type: "string", minLength: 1, maxLength: 64},
      password: {type: "string", minLength: 6},
      // validation of the email address is done at the client side, after which the confirmation email is sent
    },
    required: ["firstName", "lastName", "password", "email"],
  };

  public id?: number;
  public language?: string;
  public firstName?: string;
  public lastName?: string;
  public password?: string;
  public email?: string;
  public updatedAt?: string;
  public createdAt?: string;
  public organisations?: ReadonlyArray<{id: number, userRole: number}>;

  private acceptTOS?: boolean;
  private retypePassword?: string;

  public $formatJson(json: Pojo) {
    return omit(["password", "updatedAt", "createdAt"], super.$formatJson(json));
  }

  public async $beforeInsert() {
    if (this.retypePassword !== this.password) {
      throw [400, "Passwords do not match"];
    }
    if (!this.acceptTOS) {
      throw [400, "Terms of service have to be accepted before creating an account"];
    }

    delete this.acceptTOS;
    delete this.retypePassword; // column does not exists in database
    this.password = await hashPassword(this.password as string); // password required and validated by json schema
    this.firstName = titleCase(this.firstName);
    this.lastName = titleCase(this.lastName);
    this.email = lowerCase(this.email);
  }

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.retypePassword; // column does not exists in database
    delete this.createdAt; // should not update createdAt field
    delete this.email; // TODO: send email confirmation if email update was requested

    if (this.password)  {
      this.password = await hashPassword(this.password);
    }
    this.updatedAt = new Date().toISOString();
    this.firstName = this.firstName && titleCase(this.firstName);
    this.lastName = this.lastName && titleCase(this.lastName);
  }

  public async $afterInsert() {
    // TODO: send email confirmation
  }
}

// hash and salt plain text password
export const hashPassword = async (password: string): Promise<string> => bcrypt.hash(
  password || "", // objection validates according to provided json schema
  await bcrypt.genSalt(10)
);
