import React from "react";

import button from "../../../styles/button";
import { actionsRow, form } from "../../../styles/form";

const {PROTOCOL, API_PREFIX, BASE_URL} = process.env;

export default ({taskHash, applianceHash}: {taskHash: string; applianceHash: string}) => (
  <form
    method="POST"
    className={form}
    action={`${PROTOCOL}://${BASE_URL}${API_PREFIX}/maintenance/${applianceHash}/${taskHash}/accept`}
  >
    <div className={actionsRow}>
      <span></span>
      <button className={button} type="submit">
        Accept task
      </button>
    </div>
  </form>
);
