import React from "react";

import { apiURL } from "../../../config";
import button from "../../../styles/button";
import { actionsRow, form, inputRow } from "../../../styles/form";
import { label } from "../../../styles/inline";
import input from "../../../styles/input";
import Subscribe from "./Subscribe";

export default ({hash}: { hash: string }) => (
  <form method="POST" className={form} action={`${apiURL}/maintenance/${hash}`}>
    <label className={label} htmlFor="description">
      Description
    </label>
    <div className={inputRow}>
      <textarea
        className={input}
        name="description"
        id="description"
        rows={3}
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
