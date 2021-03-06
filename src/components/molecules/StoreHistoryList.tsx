/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Button } from "components/atoms/Button";
import { Input } from "components/atoms/Input";
import { ResetBtn } from "components/atoms/ResetBtn";
import { useStoreInstance } from "hooks/useStoreInstance";
import * as React from "react";
import { useIsolatedStore, useStore } from "react-stores";
import { mergeClassNames } from "utils";

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
      filter: "",
      sort: false
    },
    {
      persistence: true,
      name: `history`
    }
  );
  const storeInstance = useStoreInstance();
  const { items } = useStore(storeInstance.history);

  const filteredItems = React.useMemo(
    () =>
      items
        .map((item, index, arr) => {
          const time = new Date(
            index === 0
              ? item.timestamp
              : item.timestamp - arr[index - 1].timestamp
          );
          return {
            ...item,
            id: index,
            timeValue: (
              <span>
                {index !== 0 && "+"}
                {index !== 0
                  ? times(time.getUTCHours(), 2)
                  : times(time.getHours(), 2)}
                :{times(time.getMinutes(), 2)}:{times(time.getSeconds(), 2)}
                <span css={milliseconds}>
                  {times(time.getMilliseconds(), 3)}
                </span>
              </span>
            )
          };
        })
        .sort((a, b) =>
          storeUI.state.sort
            ? a.timestamp - b.timestamp
            : b.timestamp - a.timestamp
        )
        .filter(
          item =>
            !storeUI.state.filter ||
            item.action
              .toLowerCase()
              .indexOf(storeUI.state.filter.toLowerCase()) >= 0
        )
        .sort((a, b) => {
          return (
            a.action.toLowerCase().indexOf(storeUI.state.filter.toLowerCase()) -
            b.action.toLowerCase().indexOf(storeUI.state.filter.toLowerCase())
          );
        }),
    [items, storeUI.state.filter, storeUI.state.sort]
  );
  return (
    <div css={layout}>
      <div css={settingsBox}>
        <Button
          theme="tab_light"
          onClick={() =>
            storeUI.setState({
              sort: !storeUI.state.sort
            })
          }
          title="Set sorting events by timestamp"
        >
          {storeUI.state.sort ? <span>&#9660;</span> : <span>&#9650;</span>}
        </Button>
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <Input
            css={input}
            onChange={event =>
              storeUI.setState({ filter: (event.target as any).value })
            }
            placeholder="Filter actions"
            defaultValue={storeUI.state.filter}
          />
          <ResetBtn
            visible={Boolean(storeUI.state.filter)}
            onClick={() => storeUI.setState({ filter: "" })}
            title="Clear filter"
          />
        </div>
      </div>
      <div css={[root]}>
        {!filteredItems.length && <div css={message}>Actions not found</div>}
        {filteredItems.map((historyItem, index, array) => {
          return (
            <div
              key={index}
              onClick={() => {
                onChangeActive(historyItem.id);
              }}
              className={mergeClassNames([
                historyItem.id === activeIndex && "active"
              ])}
              css={historyItemCn}
            >
              <span css={nameCn}>{historyItem.action}</span>
              <span
                css={timeCn}
                title={new Date(historyItem.timestamp).toLocaleTimeString()}
              >
                {historyItem.timeValue}
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
  padding: 0 8px 0 0;
  height: 30px;
  align-items: center;
  border-bottom: var(--border);
  border-color: var(--border-faded-color);
  background: var(--bg-base-color);
  color: var(--text-base-color);
  flex: 0 0 30px;
  justify-content: space-between;
  align-content: center;
`;

const message = css`
  color: var(--text-fade-color);
  font-style: italic;
  margin-bottom: 5px;
  padding: 4px 8px;
  text-align: center;
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

const nameCn = css``;
const timeCn = css`
  color: var(--text-fade-color);
`;

const milliseconds = css`
  margin-left: 5px;
  padding: 3px 6px;
  background: var(--box-bg-color);
  border-radius: 3px;
  color: var(
    ${chrome.devtools.panels.themeName === "dark"
      ? "--text-base-color"
      : "--text-inverse"}
  );
  letter-spacing: 0.5px;
  text-align: right;
  width: 32px;
  display: inline-block;
`;
