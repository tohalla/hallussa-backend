import { css } from "emotion";
import { stacked } from "./container";
import { error } from "./inline";
import { indicator, text } from "./variables/colors";
import { inputHeight } from "./variables/sizes";
import { minimal, minor } from "./variables/spacing";

const input = css`
  border: none;
  outline: none;
  padding: ${minimal} ${minor};

  &:not(textarea) {
    height: ${inputHeight};
  }

  &::placeholder {
    color: ${text.neutral};
  }
`;

export const invalid = css`
  border: 1px solid ${indicator.error};
`;

export const inputContainer = css`
  ${stacked}
  position: relative;
`;

export const inputError = css`
  ${error}
  position: absolute;
  top: 100%;
`;

export default input;
