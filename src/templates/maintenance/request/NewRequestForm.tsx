import React from "react";

import button from "../../../emotion-styles/src/button";
import { actionsRow, form, inputRow } from "../../../emotion-styles/src/form";
import { label } from "../../../emotion-styles/src/inline";
import input from "../../../emotion-styles/src/input";
import Subscribe from "./Subscribe";

export default ({hash}: { hash: string }) => (
  <form method="POST" className={form} action={`./${hash}`}>
    <label className={label} htmlFor="description">
      Description
    </label>
    <div className={inputRow}>
      <textarea
        className={input}
        style={{ height: "200px" }}
        name="description"
        id="description"
        placeholder="Short description of the problem"
      />
    </div>
    <Subscribe />
    <div className={actionsRow}>
      <span></span>
      <button className={button} type="submit">
        Send maintenance report
      </button>
    </div>
  </form>
);
