import { css } from "emotion";
import { indicator, primary, text } from "./variables/colors";
import { buttonHeight } from "./variables/sizes";
import { minimal, normal } from "./variables/spacing";

const button = css`
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: ${text.light};
  background: ${primary.neutral};
  padding: ${minimal} ${normal};
  text-transform: uppercase;
  font-size: 75%;
  white-space: nowrap;
  line-height: 1.1;
  flex: 0;
  user-select: none;
  height: ${buttonHeight};
  text-decoration: none;

  &:hover {
    color: ${text.light};
    background: ${primary.dark};
  }

  &:disabled {
    background: ${indicator.disabled};
    &:hover {
      text-decoration: none;
      background: ${indicator.disabled};
    }
  }
`;

export const plain = css`
  cursor: default;
  background: none;
  border: none;
  white-space: nowrap;
  padding: 0;
  margin: 0;
  &:hover {
    background: none;
    text-decoration: underline;
  }
`;

export default button;
