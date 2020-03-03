/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useStoreInstance } from "hooks/useStoreInstance";
import { ObjectViewer } from "components/atoms/ObjectViewer";
import { useStore } from "react-stores";
import { HeadDivider } from "components/atoms/HeadDivider";

export const StoreState: React.FC<{}> = () => {
  const storeInstance = useStoreInstance();
  const store = useStore(storeInstance.store);
  const meta = useStore(storeInstance.meta);

  return (
    <div css={root}>
      <div css={object}>
        <ObjectViewer obj={store} />
      </div>
      <div css={metafooter}>
        <div css={item}>
          <div css={item}>Update times: {meta.updateTimes}</div>
          <HeadDivider />
          <div css={item}>Listeners: {meta.listnersNumber}</div>
        </div>
        <div css={item}>Version: {meta.version}</div>
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
  padding: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 calc(100% - 30px);
  height: calc(100% - 30px);
  border-bottom: var(--border);
  border-color: var(--border-faded-color);
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
  white-space: nowrap;
`;

const item = css`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;
