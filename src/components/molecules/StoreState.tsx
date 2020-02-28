/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { useStoreInstance } from "hooks/useStoreInstance";
import { ObjectViewer } from "components/atoms/ObjectViewer";

export const StoreState: React.FC<{}> = () => {
  const { activeStore } = useGlobalState();
  const store = useStoreInstance(activeStore);
  return (
    <div css={root}>
      <div css={object}>
        <ObjectViewer obj={store.store.state} />
      </div>
      <div css={metafooter}>
        <div css={item}>Update times: {store.meta.state.updateTimes}</div>
        <div css={item}>Version: {store.meta.state.version}</div>
      </div>
    </div>
  );
};

const root = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const object = css`
  padding: 4px 8px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 calc(100% - 30px);
  height: calc(100% - 30px);
  border-bottom: var(--border);
`;

const metafooter = css`
  flex: 0 0 30px;
  height: 30px;
  padding: 4px 8px;
  line-height: 22px;
  background: var(--bg-base-color);
  color: var(--text-base-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const item = css``;
