import React from "react";

import button from "../../../emotion-styles/src/button";
import { actionsRow, form, inputRow } from "../../../emotion-styles/src/form";

export default ({
  taskHash,
}: {
  taskHash: string;
}) => (
  <form method="POST" className={form} action={`./${taskHash}/accept`}>
    <div className={actionsRow}>
      <span></span>
      <button className={button} type="submit">
        Accept task
      </button>
    </div>
  </form>
);
