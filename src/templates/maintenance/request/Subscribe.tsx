import React from "react";

import { inputRow } from "../../../emotion-styles/src/form";
import { label } from "../../../emotion-styles/src/inline";
import input from "../../../emotion-styles/src/input";

export default () => (
  <>
    <p>
      You can also subscribe for email notifications for this appliance.
    </p>
    <label className={label} htmlFor="subscribe">
      Subscribe (optional)
    </label>
    <div className={inputRow}>
      <input
        type="email"
        className={input}
        name="subscribe"
        id="subscribe"
        placeholder="example@domain.com"
      />
    </div>
  </>
);
