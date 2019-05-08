import React from "react";

import { apiURL } from "../../../config";
import button from "../../../styles/button";
import { actionsRow, form } from "../../../styles/form";
import Subscribe from "./Subscribe";

export default ({hash}: { hash: string }) => (
  <form method="POST" className={form} action={`${apiURL}/maintenance/${hash}`}>
    <Subscribe />
    <div className={actionsRow}>
      <span></span>
      <button className={button} type="submit">
        Subscribe
      </button>
    </div>
  </form>
);
