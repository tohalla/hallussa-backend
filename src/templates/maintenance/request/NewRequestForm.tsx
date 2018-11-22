import React from "react";

import button from "../../../emotion-styles/src/button";
import { actionsRow, form, inputRow } from "../../../emotion-styles/src/form";

export default ({hash}: { hash: string }) => (
  <form method="POST" className={form} action={`./${hash}`}>
    <input type="text" name="description"></input>
    <div className={actionsRow}>
      <button className={button} type="submit">
        Send maintenance report
      </button>
    </div>
  </form>
);
