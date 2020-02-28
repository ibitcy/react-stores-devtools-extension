/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { StoreState } from "components/molecules/StoreState";
import { StoreSettings } from "components/molecules/StoreSettings";
import { Button } from "components/atoms/Button";
import { useIsolatedStore } from "react-stores";
import { mergeClassNames } from "utils";
import { StateDispatcher } from "components/molecules/StateDispatcher";

enum ETabs {
  State = "State",
  Settings = "Settings",
  DispatchState = "Dispatch state"
}

export const StoreInspect: React.FC<{}> = () => {
  const { activeStore } = useGlobalState();
  const store = useIsolatedStore(
    {
      activeTab: ETabs.State
    },
    {
      persistence: true,
      name: `inspect_${activeStore}`
    }
  );

  return (
    <React.Fragment>
      <div css={settingsBox}>
        {Object.keys(ETabs).map(key => (
          <Button
            key={key}
            theme="tab"
            className={mergeClassNames([
              store.state.activeTab === ETabs[key] && "active"
            ])}
            onClick={() => {
              store.setState({
                activeTab: ETabs[key]
              });
            }}
          >
            {ETabs[key]}
          </Button>
        ))}
      </div>
      <div css={root}>
        <div>
          {store.state.activeTab === ETabs.State && <StoreState />}
          {store.state.activeTab === ETabs.Settings && <StoreSettings />}
          {store.state.activeTab === ETabs.DispatchState && (
            <StateDispatcher
              onDispatch={() => {
                store.setState({
                  activeTab: ETabs.State
                });
              }}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

const settingsBox = css`
  display: flex;
  padding: 0;
  height: 30px;
  align-items: center;
  border-bottom: var(--border);
  background: var(--bg-base-color);
  color: var(--text-base-color);
`;

const root = css`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 30px);
  > * {
    width: 100%;
    flex: 1 1 100px;
    height: 100%;
  }
`;
