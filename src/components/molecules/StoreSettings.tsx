/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { useStoreInstance } from "hooks/useStoreInstance";
import { ObjectViewer } from "components/atoms/ObjectViewer";

export const StoreSettings: React.FC<{}> = () => {
  const { activeStore } = useGlobalState();
  const store = useStoreInstance(activeStore);
  return (
    <div css={root}>
      <div css={object}>
        <ObjectViewer flat noHightlight obj={store.options} />
      </div>
    </div>
  );
};

const root = css`
  padding: 4px 8px;
`;

const object = css`
  padding-top: 4px;
  margin-left: -4px;
`;
