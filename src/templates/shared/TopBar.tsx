import React, { ReactFragment } from "react";

import { topbar } from "../../styles/topbar";

export default ({children}: { children: ReactFragment }) => (
  <div className={topbar}>
    {children}
  </div>
);
