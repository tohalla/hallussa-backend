import React from "react";

import button from "../../../emotion-styles/src/button";
import { actionsRow, form, inputRow } from "../../../emotion-styles/src/form";
import Subscribe from "./Subscribe";

const {PROTOCOL, API_PREFIX, BASE_URL} = process.env;

export default ({hash}: { hash: string }) => (
  <form method="POST" className={form} action={`${PROTOCOL}://${BASE_URL}${API_PREFIX}/maintenance/${hash}`}>
    <Subscribe />
    <div className={actionsRow}>
      <span></span>
      <button className={button} type="submit">
        Subscribe
      </button>
    </div>
  </form>
);
