import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import button from "../../emotion-styles/src/button";
import { form } from "../../emotion-styles/src/form";

export default (hash: string) => renderStylesToString(renderToStaticMarkup(
  <body>
    <div>
      <p>This is the hash: {hash}</p>
      Hello world! testaan maailmaa. Moi taas
      <button className={button}>Click me!</button>
      <form method="POST" className={form} action="#">
        <input type="text"></input>
      </form>
    </div>
  </body>
));
