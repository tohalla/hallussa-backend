import React, { ReactFragment } from "react";

import { topbar } from "../../emotion-styles/src/topbar";

export default ({children}: { children: ReactFragment }) => (
  <div className={topbar}>
    {children}
  </div>
);
