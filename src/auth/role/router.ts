import Router from "koa-router";

import UserRole from "./UserRole";

export default new Router({ prefix: "/roles" })
  .get("/", async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    ctx.body = await UserRole
      .query()
      .select()
      .where("organisation", "=", organisation)
      .orWhereNull("organisation")
      .eager(ctx.query.eager);
  });
