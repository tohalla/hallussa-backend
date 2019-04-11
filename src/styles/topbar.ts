import { css } from "emotion";
import { sm } from "./variables/breakpoints";
import { greyscale, text } from "./variables/colors";
import { base, small } from "./variables/fontSizes";
import { major, minor, normal } from "./variables/spacing";

export const navGroup = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;

  & + & {
    margin-left: ${normal};
  }

  @media (max-width: ${sm}px) {
    align-items: stretch;
    flex-direction: column;
    & + & {
      margin-left: 0;
    }
  }
`;

export const logoContainer = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  margin-right: ${major};

  a {
    height: 100%;
  }

  @media (max-width: ${sm}px) {
    margin: 11px;
  }
`;

export const uppercaseTitle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  padding: ${normal};
  color: ${text.light};
  text-transform: uppercase;
  text-decoration: none;

  @media (max-width: ${sm}px) {
    padding-left: 0;
  }
`;

export const navItem = css`
  ${uppercaseTitle}

  &:hover {
    color: ${text.light};
    text-decoration: underline;
  }
`;

export const activeItem = css`
  font-weight: 900;
  text-decoration: none !important;
`;

export const topbar = css`
  color: ${text.light};
  font-size: ${small};
  line-height: ${base};

  min-height: ${major};
  display: flex;
  justify-content: space-between;
  align-items: stretch;

  padding: 0 ${normal};
  background: ${greyscale[2]};

  @media (max-width: ${sm}px) {
    font-size: ${base};
    align-items: stretch;
    flex-direction: column;
  }
`;

export const toggleButton = css`
  display: none;
  line-height: ${base};
  color: ${text.light};
  user-select: none;
  padding: ${normal} 0;

  @media (max-width: ${sm}px) {
    display: flex;
  }
`;

export const plainTopbar = css`
  color: ${text.light};
  background: ${greyscale[2]};
  display: flex;
  flex-direction: row;
  padding: 0 ${minor};
`;

export const plainFooter = css`
  color: ${text.light};
  background: ${greyscale[2]};
  display: flex;
  flex-direction: column;
  padding: ${normal} ${normal};
`;

export const textMiddle = css`
  color: ${text.light};
  text-transform: uppercase;
  align-content: center;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 ${normal};
`;
