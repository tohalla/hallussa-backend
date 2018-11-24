import React from "react";

import { link } from "../../emotion-styles/src/inline";

export default () => (
  <footer>
    <div>
      <a className={`${link} white`} href="#">https://hallussa.com/</a>
      <p>Otakaari 1</p>
      <p>02150, Espoo</p>
      <p>Finland</p>
    </div>
    <div>
      <a className={`${link} white`} href="/terms-of-service.html">Terms of service</a>
    </div>
  </footer>
);
