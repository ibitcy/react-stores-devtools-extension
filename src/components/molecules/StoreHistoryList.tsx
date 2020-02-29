/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { useStoreInstance } from "hooks/useStoreInstance";
import { mergeClassNames } from "utils";
import { Cross } from "components/atoms/Cross";
import { Input } from "components/atoms/Input";
import { useIsolatedStore, useStore } from "react-stores";

interface IProps {
  activeIndex: number;
  onChangeActive(newIndex: number): void;
}

export const StoreHistoryList: React.FC<IProps> = ({
  activeIndex,
  onChangeActive
}) => {
  const storeUI = useIsolatedStore(
    {
      filter: ""
    },
    {
      persistence: true,
      name: `history`
    }
  );
  const { activeStore } = useGlobalState();
  const storeInstance = useStoreInstance(activeStore);
  const { items } = useStore(storeInstance.history);

  const filteredItems = React.useMemo(
    () =>
      !storeUI.state.filter
        ? items
        : items
            .filter(
              item =>
                item.action
                  .toLowerCase()
                  .indexOf(storeUI.state.filter.toLowerCase()) >= 0
            )
            .sort((a, b) => {
              return (
                a.action
                  .toLowerCase()
                  .indexOf(storeUI.state.filter.toLowerCase()) -
                b.action
                  .toLowerCase()
                  .indexOf(storeUI.state.filter.toLowerCase())
              );
            }),
    [items, storeUI.state.filter]
  );
  return (
    <div css={layout}>
      <div css={settingsBox}>
        <Input
          css={input}
          onChange={event =>
            storeUI.setState({ filter: (event.target as any).value })
          }
          placeholder="Filter actions"
          defaultValue={storeUI.state.filter}
        />
        <button
          css={[reset, storeUI.state.filter && visibleReset]}
          onClick={() => storeUI.setState({ filter: "" })}
          title="Clear filter"
        >
          <Cross />
        </button>
      </div>
      <div css={root}>
        {filteredItems.map((historyItem, index, array) => {
          const time = new Date(
            index === 0
              ? historyItem.timestamp
              : historyItem.timestamp - array[index - 1].timestamp
          );
          return (
            <div
              onClick={() => {
                onChangeActive(index);
              }}
              className={mergeClassNames([index === activeIndex && "active"])}
              css={historyItemCn}
            >
              <span css={nameCn}>{historyItem.action}</span>
              <span css={timeCn}>
                {index !== 0 && "+"}
                {index !== 0
                  ? times(time.getUTCHours(), 2)
                  : times(time.getHours(), 2)}
                :{times(time.getMinutes(), 2)}:{times(time.getSeconds(), 2)}
                <span css={milliseconds}>
                  {times(time.getMilliseconds(), 3)}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function times(time: number, times: number): string {
  return (
    new Array(times - String(time).length).fill("0").join("") + String(time)
  );
}

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
`;

const settingsBox = css`
  display: flex;
  padding: 0 8px;
  height: 30px;
  align-items: center;
  border-bottom: var(--border);
  border-color: var(--border-faded-color);
  background: var(--bg-base-color);
  color: var(--text-base-color);
  flex: 0 0 30px;
  justify-content: flex-end;
`;

const historyItemCn = css`
  padding: 8px 8px;
  color: var(--text-base-color);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border);
  border-color: var(--border-faded-color);

  &:hover {
    background-color: var(--hover-faded-color);
  }

  &.active {
    background-color: var(--bg-hover-color);
  }
`;

const input = css`
  width: 150px;
`;

const reset = css`
  width: 12px;
  padding: 0;
  height: 12px;
  cursor: pointer;
  background: none;
  border: none;
  background: var(--text-base-color);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  background-size: 10px;
  pointer-events: none;
  border-radius: 50%;
  position: relative;
  transform: translateX(calc(-100% - 4px));
  outline: none;
  color: white;
  font-size: 10px;
  margin-right: -12px;
`;

const visibleReset = css`
  pointer-events: all;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const nameCn = css``;
const timeCn = css`
  color: var(--text-fade-color);
`;

const milliseconds = css`
  margin-left: 5px;
  padding: 3px 6px;
  background: var(--box-bg-color);
  border-radius: 3px;
  color: var(--text-base-color);
  letter-spacing: 0.5px;
  text-align: right;
  width: 32px;
  display: inline-block;
`;
