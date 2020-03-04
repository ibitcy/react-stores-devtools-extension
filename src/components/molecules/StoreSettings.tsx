/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import { ObjectViewer } from "components/atoms/ObjectViewer";
import { useStoreInstance } from "hooks/useStoreInstance";
import * as React from "react";

export const StoreSettings: React.FC<{}> = () => {
  const storeInstance = useStoreInstance();
  return (
    <div css={root}>
      <ObjectViewer flat noHighlight obj={storeInstance.options} />
    </div>
  );
};

const root = css`
  padding: 8px 8px 8px 0px;
`;
