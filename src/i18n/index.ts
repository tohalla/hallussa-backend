
import i18n from "i18next";
import { pluck } from "ramda";

import Language from "./Language";
import Translation, { normalizeTranslations } from "./Translation";

export const initializeI18n = async () => {
  const languages = pluck("locale", await Language.query().select("locale")) as string[];

  await i18n.init({
    defaultNS: "backend",
    fallbackLng: "en",
    ns: ["backend"],
  });

  i18n.languages = languages;
  i18n.language = "en";

  return Promise.all(i18n.languages.map(async (lng) =>
    i18n.addResourceBundle(lng, "backend", await fetchTranslations(lng, "backend"))
  ));
};

export const fetchTranslations = async (locale: string, namespace = "common") =>
  normalizeTranslations((await Translation
    .query()
    .select("key", "translation")
    .joinRaw(
      "JOIN language ON language.locale=?::text " +
      "AND translation.language=language.locale",
      locale
    )
    .where("namespace", namespace)
  ) as any);
