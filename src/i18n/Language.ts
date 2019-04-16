import { Model } from "objection";
import Translation from "./Translation";

export default class Language extends Model {
  public static tableName = "language";

  public static relationMappings = {
    maintainers: {
      join: {
        from: "language.locale",
        to: "translation.language",
      },
      modelClass: Translation,
      relation: Model.HasManyRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      languageCode: { type: "string", maxLength: 3 },
      languageShortCode: { type: "string", maxLength: 2 },
      locale: { type: "string", maxLength: 5 },
      name: { type: "string", maxLength: 128 },
    },
    required: ["locale", "name"],
  };

  public locale: string;
  public name: string;
  public languageCode?: string;
  public languageShortCode?: string;
  public translations: Readonly<Translation[]> = [];
}
