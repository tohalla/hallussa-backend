import { Model } from "objection";

import Account from "../account/Account";

// interface for objection relatedQueries
export interface OrganisationAccountRelation extends Model {
  id: number;
  isAdmin: boolean;
}

export default class Organisation extends Model {
  public static tableName = "organisation";

  public static relationMappings = {
    accounts: {
      join: {
        from: "organisation.id",
        through: {
          extra: ["isAdmin"],
          from: "organisation_account.organisation",
          to: "organisation_account.account",
        },
        to: "account.id",
      },
      modelClass: Account,
      relation: Model.ManyToManyRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      id: { type: "integer" },

      name: { type: "string", minLength: 1, maxLength: 64 },
      organisationIdentifier: { type: "string", minLength: 1, maxLength: 64 },
    },
    required: ["name"],
  };

  public id?: number;
  public updatedAt?: string;

  public async $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
