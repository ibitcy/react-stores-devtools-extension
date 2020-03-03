/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { useEffectOnce } from "hooks/useEffectOnce";
import { mergeClassNames } from "utils";
import { Input } from "components/atoms/Input";
import { Atom } from "components/atoms/Atom";
import { Cross } from "components/atoms/Cross";
import { TStoreListItem } from "types";
import { HeadDivider } from "components/atoms/HeadDivider";

interface IProps {
  storesList: TStoreListItem[];
}

export const StoreList: React.FC<IProps> = ({ storesList }) => {
  const { activeStore, setActiveStore } = useGlobalState();
  const [filter, setFilter] = React.useState("");
  useEffectOnce(() => {
    if (storesList.length < 0) {
      return false;
    }
    setActiveStore(storesList[0].name);
    return true;
  }, [storesList]);

  const filteredItems = React.useMemo(
    () =>
      !filter
        ? storesList.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          })
        : storesList
            .filter(
              item => item.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
            )
            .sort((a, b) => {
              return (
                a.name.toLowerCase().indexOf(filter.toLowerCase()) -
                b.name.toLowerCase().indexOf(filter.toLowerCase())
              );
            }),
    [storesList, filter]
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
        <HeadDivider />
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
        {filteredItems.map(storeItem => {
          return (
            <div
              key={storeItem.name}
              className={mergeClassNames([
                activeStore === storeItem.name && "active"
              ])}
              title={storeItem.active ? "Store is active" : "Store disabled"}
              css={[storeItemCn]}
              onMouseDown={() => {
                setActiveStore(storeItem.name);
              }}
            >
              {storeItem.name}
              {!storeItem.active && <span css={disabledCircle} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const atom = css`
  width: 20px;
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

const settingsBox = css`
  display: flex;
  padding: 4px 8px;
  height: 30px;
  border-bottom: var(--border);
  background: var(--bg-base-color);
  color: var(--text-base-color);
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
  align-items: stretch;
  border-color: var(--border-faded-color);
`;

const input = css`
  width: 130px;
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
  margin-right: -12px;
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

const storeItemCn = css`
  padding: 4px 8px;
  margin-bottom: 1px;
  color: var(--text-base-color);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: var(--hover-faded-color);
  }

  &.active {
    background-color: var(--hover-color);
  }
`;

const disabledCircle = css`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--code-red);
`;
