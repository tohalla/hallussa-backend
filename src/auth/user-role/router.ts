import Router from "koa-router";

import UserRole from "./UserRole";

export default () => new Router({ prefix: "/user-roles" })
  .get("/", async (ctx) => {
    // organisation param possibly set in parent router
    const { organisation } = ctx.params;
    const query = UserRole.query().whereNull("organisation").select();

    ctx.body = await (organisation ? query.orWhere("organisation", "=", organisation) : query);
  });
