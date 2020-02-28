/* @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";

export const Input: React.FC<React.HTMLAttributes<
  HTMLInputElement
>> = props => {
  return <input value={props.defaultValue} css={input} {...props} />;
};

const input = css`
  border: var(--border);
  padding-left: 3px;
  padding-right: 3px;
  background: var(--bg-dark-color);
  line-height: 16px;
  color: var(--text-fade-color);
  width: 100%;
  border-color: transparent;

  &:hover {
    border-color: var(--border-color);
  }

  &:focus {
    outline: none;
    border-color: var(--hover-color);
  }
`;
