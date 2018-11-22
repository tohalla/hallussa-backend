import React, { ReactFragment } from "react";

import { appContainer } from "../../emotion-styles/src/container";

export default ({children}: { children: ReactFragment }) => (
  <div className={appContainer}>
    {children}
  </div>
);
