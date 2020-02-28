/* @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "tab";
}

export const Button: React.FC<IProps> = ({ theme, ...props }) => {
  return <button css={[button, themes[theme]]} {...props} />;
};

const button = css`
  border: none;
  outline: none;
  color: var(--text-base-color);
  background: transparent;
  padding: 8px 20px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 3px;
  border: var(--border);
  font-weight: bold;

  &:hover:not([disabled]) {
    background: var(--bg-base-color);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const themes = {
  tab: css`
    font-weight: normal;
    border: none;
    padding: 7px 12px;
    border-radius: 0;

    &:hover:not([disabled]):not(.active) {
      background: var(--bg-dark-color);
    }

    &.active {
      &:hover {
        background: black;
      }
      background: black;
    }
  `
};
