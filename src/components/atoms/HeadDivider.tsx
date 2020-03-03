/* @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";

export const HeadDivider: React.FC<{}> = () => {
  return <div css={delimitter} />;
};

const delimitter = css`
  border-right: var(--border);
  opacity: 0.4;
  margin: 1px 8px;
`;
