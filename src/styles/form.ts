import { css } from "emotion";

import { sm } from "./variables/breakpoints";
import { normal } from "./variables/spacing";

export const form = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 300px;

  @media (max-width: ${sm}px) {
    max-width: 90vw;
    overflow: hidden;
  }
`;

export const inputRow = css`
  display: flex;
  align-items: center;
  justify-content: stretch;
  padding-bottom: ${normal};
  width: 100%;

  & > * {
    flex: 1;
  }
  input {
    flex: 2;
  }
  & > *:not(style) + * {
    margin-left: ${normal};
  }
`;

export const actionsRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
