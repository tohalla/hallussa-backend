import { path } from "ramda";

export const templateIDs = {
  en: {
    repairRequest: "d-4675ebe8b63b4e16884b65b47e90094e",
  },
};

export const getTemplateIDByLanguage = (language: string, template: keyof typeof templateIDs["en"]): string =>
  path([language, template], templateIDs) || templateIDs.en[template];
