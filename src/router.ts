import Router from "koa-router";
import organisations from "./organisations/router";

export default new Router()
  .use(organisations.routes())
  .use(organisations.allowedMethods());
