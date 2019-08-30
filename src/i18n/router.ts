import Router from "koa-router";
import { fetchTranslations } from ".";
import Language from "./Language";

export default new Router({ prefix: "/i18n" })
  .get("/languages", async (ctx) => {
    ctx.body = await Language.query().select();
  })
  .get("/languages/:locale", async (ctx) => {
    const locale = ctx.params.locale;
    const {ns = "common"} = ctx.query;

    ctx.body = await fetchTranslations(locale,  ns);
  });
