import { Model, RelationMappings, snakeCaseMappers } from "objection";
import { evolve, map, prop } from "ramda";

import OrganisationAccount from "../relation-models/OrganisationAccount";
import OrganisationPreferences from "./Preferences";

export default class Organisation extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "organisation";

  public static relationMappings: RelationMappings = {
    accounts: { // should never eagerly load accounts, only ID's
      join: {
        from: "organisation.id",
        to: "organisation_account.organisation",
      },
      modelClass: OrganisationAccount,
      relation: Model.HasManyRelation,
    },
    appliances: { // should never eagerly load appliances, only ID's
      join: {
        from: "organisation.id",
        to: "appliance.organisation",
      },
      // imported here to prevent errors due to possible future circular dependencies
      modelClass: require("../appliance/Appliance").default,
      relation: Model.HasManyRelation,
    },
    maintainers: { // should never eagerly load maintainers, only ID's
      join: {
        from: "organisation.id",
        to: "maintainer.organisation",
      },
      // imported here to prevent errors due to possible future circular dependencies
      modelClass: require("../maintainer/Maintainer").default,
      relation: Model.HasManyRelation,
    },
    preferences: {
      join: {
        from: "organisation.id",
        to: "organisation_preferences.organisation",
      },
      modelClass: require("./Preferences").default,
      relation: Model.HasOneRelation,
    },
    userRoles: { // should never eagerly load roles, only ID's
      join: {
        from: "organisation.id",
        to: "user_role.organisation",
      },
      // imported here to prevent errors due to possible future circular dependencies
      modelClass: require("../auth/user-role/UserRole").default,
      relation: Model.HasManyRelation,
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
  public language?: string;
  public name?: string;
  public organisationIdentifier?: string;
  public updatedAt?: string;
  public createdAt?: string;
  public accounts: ReadonlyArray<{id: number, userRole: number}> = [];
  public maintainers: ReadonlyArray<number> = [];
  public appliances: ReadonlyArray<number> = [];
  public userRoles: ReadonlyArray<number> = [];
  public preferences?: Omit<OrganisationPreferences, keyof Model>;

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field

    this.updatedAt = new Date().toISOString();
  }
}

// normalizes organisation
export const normalizeOrganisation = (organisation: Organisation | undefined) =>
 organisation && evolve({
   appliances: map(prop("id")),
   maintainers: map(prop("id")),
   userRoles: map(prop("id")),
 }, organisation as object);
