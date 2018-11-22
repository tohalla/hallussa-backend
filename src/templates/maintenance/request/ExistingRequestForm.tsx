import React from "react";

import button from "../../../emotion-styles/src/button";
import { actionsRow, form, inputRow } from "../../../emotion-styles/src/form";
import Subscribe from "./Subscribe";

export default ({hash}: { hash: string }) => (
  <form method="POST" className={form} action={`./${hash}`}>
    <Subscribe />
    <div className={actionsRow}>
      <span></span>
      <button className={button} type="submit">
        Subscribe
      </button>
    </div>
  </form>
);
