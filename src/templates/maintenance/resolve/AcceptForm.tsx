import React from "react";

import { apiURL } from "../../../config";
import button from "../../../styles/button";
import { actionsRow, form } from "../../../styles/form";

export default ({taskHash, applianceHash}: {taskHash: string; applianceHash: string}) => (
  <form
    method="POST"
    className={form}
    action={`${apiURL}/maintenance/${applianceHash}/${taskHash}/accept`}
  >
    <div className={actionsRow}>
      <span></span>
      <button className={button} type="submit">
        Accept task
      </button>
    </div>
  </form>
);
