/* @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "tab" | "tab_light";
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

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
    position: relative;

    &:hover:not([disabled]):not(.active) {
      background: var(
        ${chrome.devtools.panels.themeName === "dark"
          ? "--bg-dark-color"
          : "--bg-tab-hover-color"}
      );
    }

    &.active {
      &:hover {
        background: var(
          ${chrome.devtools.panels.themeName === "dark"
            ? "--bg-tab-hover-color"
            : ""}
        );
      }
      background: var(
        ${chrome.devtools.panels.themeName === "dark"
          ? "--bg-tab-hover-color"
          : ""}
      );

      &:before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 2px solid var(--hover-color);
        display: ${chrome.devtools.panels.themeName === "dark"
          ? "none"
          : "block"};
      }
    }
  `,
  tab_light: css`
    font-weight: normal;
    border: none;
    padding: 8px;
    border-radius: 0;
    opacity: ${chrome.devtools.panels.themeName === "dark" ? "0.5" : "1"};

    &:hover:not([disabled]):not(.active) {
      opacity: ${chrome.devtools.panels.themeName !== "dark" ? "0.5" : "1"};
    }
  `
};
