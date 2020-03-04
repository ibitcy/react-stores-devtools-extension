/* @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";

export const HeadDivider: React.FC<{}> = () => {
  return <div css={delimiter} />;
};

const delimiter = css`
  border-right: var(--border);
  opacity: 0.4;
  margin: 1px 8px;
  height: 100%;
`;
