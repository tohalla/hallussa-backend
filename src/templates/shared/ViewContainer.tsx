import React, { ReactFragment } from "react";

import { appContainer } from "../../styles/container";

export default ({children}: { children: ReactFragment }) => (
  <div className={appContainer}>
    {children}
  </div>
);
