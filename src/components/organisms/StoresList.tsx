/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { useEffectOnce } from "hooks/useEffectOnce";
import { mergeClassNames } from "utils";
import { Input } from "components/atoms/Input";
import { Atom } from "components/atoms/Atom";
import { Cross } from "components/atoms/Cross";

interface IProps {
  storesKeys: string[];
}

export const StoreList: React.FC<IProps> = ({ storesKeys }) => {
  const { activeStore, setActiveStore } = useGlobalState();
  const [filter, setFilter] = React.useState("");

  useEffectOnce(() => {
    if (storesKeys.length < 0) {
      return false;
    }
    setActiveStore(storesKeys[0]);
    return true;
  }, [storesKeys]);

  const filteredItems = React.useMemo(
    () =>
      !filter
        ? storesKeys.sort((a, b) => {
            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          })
        : storesKeys
            .filter(
              item => item.toLowerCase().indexOf(filter.toLowerCase()) >= 0
            )
            .sort((a, b) => {
              return (
                a.toLowerCase().indexOf(filter.toLowerCase()) -
                b.toLowerCase().indexOf(filter.toLowerCase())
              );
            }),
    [storesKeys, filter]
  );

  return (
    <div css={box}>
      <div css={settingsBox}>
        <span
          css={atom}
          onClick={() => {
            chrome.devtools.inspectedWindow.eval(
              'window.open("https://github.com/ibitcy/react-stores#how-to-use")'
            );
          }}
          title="Go to dock"
        >
          <Atom />
        </span>
        <div css={delimitter} />
        <Input
          css={input}
          onChange={event => setFilter((event.target as any).value)}
          placeholder="Search"
          defaultValue={filter}
        />
        <button
          css={[reset, filter && visibleReset]}
          onClick={() => setFilter("")}
          title="Clear filter"
        >
          <Cross />
        </button>
      </div>
      <div css={root}>
        {!filteredItems.length && <div css={message}>Stores not found</div>}
        {filteredItems.map(key => {
          return (
            <div
              key={key}
              className={mergeClassNames([activeStore === key && "active"])}
              css={[storeItem]}
              onMouseDown={() => {
                setActiveStore(key);
              }}
            >
              {key}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const atom = css`
  width: 20px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;

const box = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  background: var(--bg-base-color);
  height: 100%;
`;

const delimitter = css`
  border-right: var(--border);
  height: 100%;
  opacity: 0.4;
  margin: 5px 8px;
`;

const settingsBox = css`
  display: flex;
  padding: 4px 8px;
  height: 30px;
  border-bottom: var(--border);
  background: var(--bg-base-color);
  align-items: center;
  color: var(--text-base-color);
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
  border-color: var(--border-faded-color);
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
`;

const visibleReset = css`
  pointer-events: all;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const message = css`
  color: var(--text-fade-color);
  font-style: italic;
  margin-bottom: 5px;
  padding: 4px 8px;
  text-align: center;
`;

const root = css`
  width: 100%;
  height: calc(100% - 30px);
  flex: 1 1 calc(100% - 30px);
`;

const storeItem = css`
  padding: 4px 8px;
  margin-bottom: 1px;
  color: var(--text-base-color);
  cursor: pointer;

  &:hover {
    background-color: var(--hover-faded-color);
  }

  &.active {
    background-color: var(--hover-color);
  }
`;
