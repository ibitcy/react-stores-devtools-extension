/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Atom } from "components/atoms/Atom";
import { HeadDivider } from "components/atoms/HeadDivider";
import { Input } from "components/atoms/Input";
import { ResetBtn } from "components/atoms/ResetBtn";
import { useEffectOnce } from "hooks/useEffectOnce";
import { useGlobalState } from "hooks/useGlobalState";
import * as React from "react";
import { TStoreListItem } from "types";
import { mergeClassNames } from "utils";

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
        <ResetBtn
          title="Clear filter"
          onClick={() => setFilter("")}
          visible={Boolean(filter)}
        />
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
  align-items: center;
  border-color: var(--border-faded-color);
`;

const input = css`
  width: 130px;
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

    color: var(
      ${chrome.devtools.panels.themeName === "dark"
        ? "--text-base-color"
        : "--text-inverse"}
    );
  }
`;

const disabledCircle = css`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--code-red);
`;
