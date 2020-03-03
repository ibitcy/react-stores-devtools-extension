/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";

import { Cross } from "./Cross";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  visible?: boolean;
}

export const ResetBtn: React.FC<IProps> = ({ visible, ...props }) => {
  return (
    <button css={[reset, visible && visibleReset]} {...props}>
      <Cross />
    </button>
  );
};

const reset = css`
  width: 12px;
  padding: 0;
  height: 12px;
  cursor: pointer;
  background: none;
  border: none;
  background: var(
    ${chrome.devtools.panels.themeName === "dark"
      ? "--text-base-color"
      : "--border-faded-color"}
  );
  opacity: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  background-size: 10px;
  pointer-events: none;
  border-radius: 50%;
  position: relative;
  transform: translateX(calc(-100% - 4px));
  outline: none;
  margin-right: -12px;
  color: var(--bg-inverse);
  font-size: 10px;
`;

const visibleReset = css`
  pointer-events: all;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;
