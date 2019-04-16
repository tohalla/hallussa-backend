import Router from "koa-router";
import Language from "./Language";
import Translation, { normalizeTranslations } from "./Translation";

export default new Router({ prefix: "/i18n" })
  .get("/languages", async (ctx) => {
    ctx.body = await Language.query().select();
  })
  .get("/languages/:locale", async (ctx) => {
    const locale = ctx.params.locale;
    ctx.body = normalizeTranslations(await Translation
      .query()
      .select()
      .joinRaw(
        "JOIN language ON language.locale=?::text " +
        "AND translation.language=language.locale",
        locale
      ));
  });
