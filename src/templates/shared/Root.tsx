import { css } from "emotion";
import React, { ReactFragment } from "react";

import "../../styles/"; // Inject globalStyles
import { body } from "../../styles/container";

const root = css`
  ${body};
  min-height: 100vh;

  h1, h2, h3, h4, h5 {
    margin: 0;
  }

  h1 {
    font-weight: 300;
  }
`;

export default ({children}: { children: ReactFragment }) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body className={root}>
      {children}
    </body>
  </html>
);
