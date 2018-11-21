import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import button from "../../emotion-styles/src/button";

export default (hash: string) => renderToStaticMarkup(
  <body>
    <div>
      <p>This is the hash: {hash}</p>
      <button className={button}>Click me!</button>
    </div>
  </body>
);
