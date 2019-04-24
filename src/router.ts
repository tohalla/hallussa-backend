import Router from "koa-router";

import accounts from "./auth/account/router";
import auth from "./auth/router";
import test from "./dev/router";
import i18n from "./i18n/router";
import maintenance from "./maintenance/router";
import organisations from "./organisation/router";

const router = new Router({ prefix: "/api/v1" });

[accounts, auth, i18n, organisations, maintenance].forEach((r) =>
  router.use(r.routes(), r.allowedMethods())
);

if (process.env.NODE_ENV === "development") {
  router.use(test.routes(), test.allowedMethods());
}

export default router;
