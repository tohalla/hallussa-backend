import Router from "koa-router";
import organisations from "./organisations/router";

export default new Router({prefix: "/api/v1"})
  .use(organisations.routes())
  .use(organisations.allowedMethods());
