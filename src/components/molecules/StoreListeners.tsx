/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useStoreInstance } from "hooks/useStoreInstance";
import { useStore } from "react-stores";
import { HeadDivider } from "components/atoms/HeadDivider";
import { TListener } from "types";
import { TraceViewer } from "./TraceViewer";

export const StoreListeners: React.FC<{}> = () => {
  const storeInstance = useStoreInstance();
  const { list } = useStore(storeInstance.listeners);
  const meta = useStore(storeInstance.meta);

  return (
    <div css={root}>
      <div css={object}>
        {list.map(listener => (
          <ListenerItem key={listener.id} {...listener} />
        ))}
      </div>
      <div css={metaFooter}>
        <div css={item}>Update times: {meta.updateTimes}</div>
        <HeadDivider />
        <div css={item}>Listeners: {meta.listenersNumber}</div>
        <HeadDivider />
        <div css={item}>Version: {meta.version}</div>
      </div>
    </div>
  );
};

const ListenerItem: React.FC<TListener> = listener => {
  const [open, setOpen] = React.useState(false);
  return (
    <div css={rootItem}>
      <div
        css={[listenerItem, open && listenerItemCollapsibleOpen]}
        onClick={() => {
          setOpen(!open);
        }}
      >
        on {listener.id}
      </div>
      {open && (
        <div css={traceView}>
          <TraceViewer toggleAsLink traceList={listener.trace} />
        </div>
      )}
    </div>
  );
};

const rootItem = css`
  display: flex;
  flex-direction: column;
`;

const root = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const object = css`
  padding: 8px 12px 8px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 calc(100% - 30px);
  height: calc(100% - 30px);
  border-bottom: var(--border);
  border-color: var(--border-faded-color);
`;

const metaFooter = css`
  flex: 0 0 30px;
  height: 30px;
  padding: 4px 8px;
  line-height: 22px;
  background: var(--bg-base-color);
  color: var(--text-base-color);
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  white-space: nowrap;
`;

const item = css`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;

const listenerItem = css`
  margin-bottom: 1px;
  display: flex;
  padding: 3px;
  padding-left: 12px;
  margin-left: -10px;
  position: relative;
  user-select: none;
  color: var(--text-base-color);

  &::after {
    content: "▼";
    font-size: 10px;
    display: block;
    position: absolute;
    left: 0;
    top: calc(50% - 5px);
    transform: rotate(-90deg);
    color: var(--text-fade-color);
  }
`;

const listenerItemCollapsibleOpen = css`
  &::after {
    transform: rotate(0deg);
  }
`;

const traceView = css`
  padding: 8px 0 16px 4px;
`;
