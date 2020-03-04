/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { useStoreInstance } from "hooks/useStoreInstance";
import { mergeClassNames } from "utils";
import { useIsolatedStore, useStore } from "react-stores";
import { Button } from "components/atoms/Button";
import { ObjectViewer } from "components/atoms/ObjectViewer";
import { TraceViewer } from "./TraceViewer";
import { StateDiff } from "./StateDiff";

interface IProps {
  activeIndex: number;
}

enum ETabs {
  Payload = "Payload",
  State = "State",
  Diff = "Diff",
  Trace = "Trace"
}

export const StoreHistoryInspect: React.FC<IProps> = ({ activeIndex }) => {
  const storeUI = useIsolatedStore(
    {
      activeTab: ETabs.Payload
    },
    {
      persistence: true,
      name: `history_inspect`
    }
  );
  const { activeStore } = useGlobalState();
  const storeInstance = useStoreInstance();
  const { items } = useStore(storeInstance.history);
  const historyItem = React.useMemo(() => items[activeIndex], [
    activeIndex,
    activeStore
  ]);

  const availableTabs = React.useMemo(() => {
    const tabs = [];
    if (!historyItem) {
      return tabs;
    }
    if (Boolean(Object.keys(historyItem.payload).length))
      tabs.push(ETabs.Payload);
    if (Boolean(Object.keys(historyItem.state).length)) tabs.push(ETabs.State);
    if (activeIndex > 0) tabs.push(ETabs.Diff);
    if (Boolean(historyItem.trace?.length)) tabs.push(ETabs.Trace);

    return tabs;
  }, [historyItem, activeIndex]);

  const activeTab = availableTabs.includes(storeUI.state.activeTab)
    ? storeUI.state.activeTab
    : availableTabs[0];

  if (!historyItem) {
    return null;
  }

  return (
    <div css={layout}>
      <div css={settingsBox}>
        {availableTabs.map(tab => (
          <Button
            key={tab}
            theme="tab"
            className={mergeClassNames([activeTab === tab && "active"])}
            onClick={() => {
              storeUI.setState({
                activeTab: tab
              });
            }}
          >
            {tab}
          </Button>
        ))}
      </div>
      <div css={root}>
        {activeTab === ETabs.Payload && (
          <ObjectViewer noHighlight obj={historyItem.payload} />
        )}
        {activeTab === ETabs.State && (
          <ObjectViewer noHighlight obj={historyItem.state} />
        )}

        {activeTab === ETabs.Diff && activeIndex > 0 && (
          <StateDiff key={activeStore} activeIndex={activeIndex} />
        )}
        {activeTab === ETabs.Trace && (
          <TraceViewer traceList={historyItem.trace} />
        )}
      </div>
    </div>
  );
};

const layout = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const root = css`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 100%;
  padding: 8px;
`;

const settingsBox = css`
  display: flex;
  height: 30px;
  align-items: center;
  border-bottom: var(--border);
  border-color: var(--border-faded-color);
  background: var(--bg-base-color);
  color: var(--text-base-color);
  flex: 0 0 30px;
`;
