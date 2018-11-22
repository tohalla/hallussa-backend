import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import button from "../../../emotion-styles/src/button";
import { actionsRow, form, inputRow } from "../../../emotion-styles/src/form";

export default (hash: string) => renderStylesToString(renderToStaticMarkup(
  <body>
    <div>
      There already exists a request for this appliance.
      TODO: Subscription.
    </div>
  </body>
));
