/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useStoreInstance } from "hooks/useStoreInstance";
import { ObjectViewer } from "components/atoms/ObjectViewer";

export const StoreSettings: React.FC<{}> = () => {
  const storeInstance = useStoreInstance();
  return (
    <div css={root}>
      <ObjectViewer flat noHightlight obj={storeInstance.options} />
    </div>
  );
};

const root = css`
  padding: 8px 8px 8px 4px;
`;
