import { css } from "emotion";
import { greyscale, indicator, text } from "./variables/colors";
import fontSize, { large } from "./variables/fontSizes";
import { minor, normal } from "./variables/spacing";

export const dark = css`
  color: ${text.dark} !important;
`;

export const light = css`
  color: ${text.light} !important;
`;

export const small = css`
  font-size: ${fontSize.small};
`;

export const info = css`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: row;
  font-size: ${small};
  font-style: italic;
  .material-icons {
    font-size: ${large};
    margin-right: ${normal}
  }
`;

export const timestamp = css`
  ${small};
  color: ${greyscale[4]};
  font-style: italic;
`;

export const error = css`
  font-size: ${fontSize.small};
  color: ${indicator.error} !important;
`;

export const alertIndication = css`
  color: ${indicator.alert} !important;
`;

export const label = css`
  padding-bottom: ${minor};
  color: ${greyscale[4]};
`;

export const link = css`
  color: ${greyscale[2]};
  flex: 0;
  white-space: nowrap;

  &:hover {
    color: ${text.dark};
  }

  &.white {
    color: ${text.light};

    &:hover {
      color: ${greyscale[9]}
    }
  }

`;
