/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { ITrace } from "types";
import { Button } from "components/atoms/Button";

interface IProps {
  traceList: ITrace[];
  toggleAsLink?: boolean;
}

enum EMode {
  Native,
  SourceMap
}

export const TraceViewer: React.FC<IProps> = ({ traceList, toggleAsLink }) => {
  const hasSourceMaps = React.useMemo(
    () => traceList.some(item => item.sourceMap),
    [traceList]
  );
  const [mode, setMode] = React.useState(
    hasSourceMaps ? EMode.SourceMap : EMode.Native
  );

  return (
    <div css={root}>
      {traceList.map((trace, i) => {
        const traceItem = mode === EMode.Native ? trace : trace.sourceMap;
        return (
          <div
            css={traceItemCn}
            key={i}
            onClick={() => {
              chrome.devtools.panels.openResource(
                traceItem.file.replace("///", "///./"),
                traceItem.line - 1,
                () => {}
              );
            }}
          >
            <span css={name}>at {traceItem.functionName}</span>
            <span css={filename}>{traceItem.file}</span>
            <span css={place}>
              :{traceItem.column}:{traceItem.line}
            </span>
          </div>
        );
      })}
      {hasSourceMaps && (
        <Button
          css={[button, toggleAsLink && buttonLink]}
          onClick={() => {
            setMode(mode === EMode.Native ? EMode.SourceMap : EMode.Native);
          }}
        >
          {mode === EMode.Native ? "JS" : "SM"}
        </Button>
      )}
    </div>
  );
};

const root = css`
  margin-top: -8px;
  margin-left: -8px;
  margin-right: -8px;
  margin-bottom: -8px;
  position: relative;
  height: calc(100% + 16px);
`;

const traceItemCn = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-fade-color);
  padding: 6px 8px 6px 12px;
  white-space: nowrap;
  width: 100%;
  margin-bottom: 2px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: var(--bg-hover-color);
  }
`;

const name = css`
  flex: 1 0 auto;
  margin-right: 10px;
  color: var(--text-base-color);
`;

const filename = css`
  flex: 10 1 100%;
  min-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: right;
  direction: rtl;
`;

const place = css`
  flex: 1 0 auto;
  color: var(--text-primary-color);
`;

const button = css`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 9px;
  padding: 4px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

const buttonLink = css`
  top: -22px;
  border: none;
  padding: 0;
  right: 4px;

  &:hover:not([disabled]):not(.active) {
    background: transparent;

    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-color: var(--text-primary-color);
  }
`;
