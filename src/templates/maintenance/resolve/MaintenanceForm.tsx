import React from "react";

import button from "../../../emotion-styles/src/button";
import { actionsRow, form, inputRow } from "../../../emotion-styles/src/form";
import { label } from "../../../emotion-styles/src/inline";
import input from "../../../emotion-styles/src/input";

export default ({taskHash}: {taskHash: string;}) => (
  <form method="POST" className={form} action={`./${taskHash}`}>
    <label className={label} htmlFor="description">
      Reason for malfunction:
    </label>
    <div className={inputRow}>
      <textarea
        className={input}
        style={{ height: "200px" }}
        name="description"
        id="description"
        placeholder="Short description of why the problem occurred."
      />
    </div>
    <div className={actionsRow}>
      <span></span>
      <button className={button} type="submit">
        Submit report
      </button>
    </div>
  </form>
);
