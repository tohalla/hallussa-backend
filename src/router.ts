import Router from "koa-router";

import accounts from "./account/router";
import auth from "./auth/router";
import organisationsRouter from "./organisation/router";

const router = new Router({ prefix: "/api/v1" });

[accounts, auth, organisationsRouter].forEach((r) =>
  router.use(r.routes(), r.allowedMethods())
);

export default router;
