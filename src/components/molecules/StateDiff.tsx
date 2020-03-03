/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { areSimilar, useStore } from "react-stores";
import { useGlobalState } from "hooks/useGlobalState";
import { useStoreInstance } from "hooks/useStoreInstance";
import { ObjectViewer } from "components/atoms/ObjectViewer";

interface IProps {
  activeIndex: number;
}

export const StateDiff: React.FC<IProps> = React.memo(({ activeIndex }) => {
  const { activeStore } = useGlobalState();
  const storeInstance = useStoreInstance();
  const { items } = useStore(storeInstance.history);
  const payload = React.useMemo(() => items[activeIndex].payload, [
    activeIndex,
    activeStore
  ]);

  const prevState = React.useMemo(() => items[activeIndex - 1].state, [
    activeIndex,
    activeStore
  ]);
  const diff = React.useMemo(() => getObjectDiff(payload, prevState), [
    payload,
    prevState
  ]);
  if (!Object.keys(diff).length) {
    return <i css={message}>states are equal</i>;
  }
  return <ObjectViewer noHightlight obj={diff} />;
});

function getObjectDiff(
  originObj: Record<any, any>,
  prevObj: Record<any, any>
): Record<any, any> {
  const diff = {};

  for (const key in originObj) {
    if (originObj.hasOwnProperty(key)) {
      const element = originObj[key];
      const prevElement = prevObj[key];
      if (!areSimilar(element, prevElement)) {
        if (isIterrable(element) && isIterrable(prevElement)) {
          diff[key] = getObjectDiff(element, prevElement);
          continue;
        } else {
          diff[key] = {
            $prev: prevElement,
            $current: element
          };
        }
      }
    }
  }

  return diff;
}

function isIterrable(value: any) {
  return (
    typeof value !== "string" &&
    ["Array", "TypedArray", "Map", "Set", "Object"].indexOf(
      Object.getPrototypeOf(value)?.constructor?.name
    ) !== -1
  );
}

const message = css`
  padding: 4px;
  color: var(--text-fade-color);
`;
