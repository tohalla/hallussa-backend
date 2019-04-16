import { Model } from "objection";
import { assocPath, reduce } from "ramda";

export default class Translation extends Model {
  public static tableName = "translation";

  public static jsonSchema = {
    type: "object",

    properties: {
      key: { type: "string" },
      language: { type: "string", maxLength: 5 },
      translation: { type: "string" },
    },
    required: ["key", "translation", "language"],
  };

  public key: string;
  public translation: string;
  public language: string;
}

interface NestedTranslation {
  [key: string]: NestedTranslation | string;
}

export const normalizeTranslations = reduce<Translation, NestedTranslation>((acc, {key, translation}) =>
  assocPath<string, NestedTranslation>(key.split("."), translation, acc), {});
