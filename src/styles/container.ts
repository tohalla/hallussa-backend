import { css } from "emotion";

import { sm } from "./variables/breakpoints";
import { greyscale } from "./variables/colors";
import { major, minor, normal } from "./variables/spacing";

export const body = css`
  font-family: "Roboto", sans-serif;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

export const appContainer = css`
  display: flex;
  flex-direction: column;
  min-width: 100vw;
  min-height: 100vh;
`;

const container = css`
  display: flex;
  flex-direction: column;
  padding: ${major};

  @media (max-width: ${sm}px) {
    padding: ${major} ${minor};
  }

  background: ${greyscale[8]};
`;

export const spacedHorizontalContainer = css`
  display: flex;
  flex: 0;
  flex-direction: row;
  align-items: center;

  & > * + * {
    margin-left: ${normal};
  }
`;

export const rowContainer = css`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`;

export const spread = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
`;

export const centerContent = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const stacked = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  & > * + * {
    margin: 0;
  }
`;

// default container used for views
export const viewContainer = css`
  ${stacked}
  margin: ${major} auto;
  width: 80vw;

  @media (max-width: ${sm}px) {
    margin: 0;
    width: 100vw;
  }
`;

export const viewContentContainer = css`
  display: flex;
  flex-direction: column;
  background-color: ${greyscale[8]};
`;

export const padded = css`
  padding: ${normal} ${major};
`;

export const emptyContainer = css`
  flex: 1;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${greyscale[4]};
`;

export const growContainer = css`
  ${container}
  flex-grow: 1;
`;

export default container;
