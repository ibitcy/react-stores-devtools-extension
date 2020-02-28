/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import { StoreHistoryInspect } from "components/molecules/StoreHistoryInspect";
import { StoreHistoryList } from "components/molecules/StoreHistoryList";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";

export const StoreHistory: React.FC<{}> = () => {
  const { activeStore } = useGlobalState();
  const [inspectedIndex, setInspected] = React.useState(0);

  React.useEffect(() => {
    setInspected(0);
  }, [activeStore]);

  return (
    <React.Fragment>
      <div css={layout}>
        <div css={box}>
          <StoreHistoryList
            activeIndex={inspectedIndex}
            onChangeActive={setInspected}
          />
        </div>
        <div css={box}>
          <StoreHistoryInspect activeIndex={inspectedIndex} />
        </div>
      </div>
    </React.Fragment>
  );
};

const layout = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const box = css`
  height: 100%;
  flex: 1 1 50%;
  min-height: 250px;

  border-bottom: var(--border);

  &:last-of-type {
    border-bottom: none;
  }
`;
