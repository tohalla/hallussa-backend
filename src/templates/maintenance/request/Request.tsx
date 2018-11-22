import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// import {} from "../../../emotion-styles/src/button";

import NewRequestForm from "./NewRequestForm";

export default (hash: string, name: string, organisation: string) => renderStylesToString(renderToStaticMarkup(
  <body>
    <h1>{name}</h1>
    <h3>{organisation}</h3>
    <div>
      <NewRequestForm hash={hash} />
    </div>
  </body>
));
