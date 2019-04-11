import React from "react";

import button from "../../../styles/button";
import { actionsRow, form, inputRow } from "../../../styles/form";
import { label } from "../../../styles/inline";
import input from "../../../styles/input";

const {PROTOCOL, API_PREFIX, BASE_URL} = process.env;

export default ({taskHash, applianceHash}: {taskHash: string; applianceHash: string}) => (
  <form
    method="POST"
    className={form}
    action={`${PROTOCOL}://${BASE_URL}${API_PREFIX}/maintenance/${applianceHash}/${taskHash}`}
  >
    <label className={label} htmlFor="description">
      Reason for malfunction:
    </label>
    <div className={inputRow}>
      <textarea
        className={input}
        rows={3}
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
