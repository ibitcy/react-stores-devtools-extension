/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { useStoreInstance } from "hooks/useStoreInstance";
import { mergeClassNames } from "utils";
import { Cross } from "components/atoms/Cross";
import { Input } from "components/atoms/Input";
import { useIsolatedStore, useStore } from "react-stores";
import { Button } from "components/atoms/Button";
import { ObjectViewer } from "components/atoms/ObjectViewer";

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
  const storeInstance = useStoreInstance(activeStore);
  const { items } = useStore(storeInstance.history);
  const historyItem = React.useMemo(() => items[activeIndex], [
    activeIndex,
    items
  ]);

  React.useEffect(() => {
    if (activeIndex === 0) {
      storeUI.setState({
        activeTab: ETabs.State
      });
    }
  }, [activeIndex]);

  return (
    <div css={layout}>
      <div css={settingsBox}>
        {Object.keys(ETabs).map(key => (
          <Button
            key={key}
            theme="tab"
            className={mergeClassNames([
              storeUI.state.activeTab === ETabs[key] && "active"
            ])}
            onClick={() => {
              storeUI.setState({
                activeTab: ETabs[key]
              });
            }}
          >
            {ETabs[key]}
          </Button>
        ))}
      </div>
      <div css={root}>
        {storeUI.state.activeTab === ETabs.Payload && (
          <ObjectViewer noHightlight obj={historyItem.payload} />
        )}
        {storeUI.state.activeTab === ETabs.State && (
          <ObjectViewer noHightlight obj={historyItem.state} />
        )}
        {storeUI.state.activeTab === ETabs.Diff && <span>here a diff</span>}
        {storeUI.state.activeTab === ETabs.Trace && <span>here a trace</span>}
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
