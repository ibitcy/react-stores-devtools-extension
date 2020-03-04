/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/keybinding-vscode";
import { Button } from "components/atoms/Button";
import { encodeData } from "utils/encoder";
import { EAction } from "types";
import { useInstance } from "hooks/useInstance";

const note = `// You mast return an object from dispatcher
// Please note for supported types for dispatching
// type TSupportedTypes = number | string | boolean | Date | Symbol | RegExp | NaN | undefined | null;
// Also supported Record<string|number, TSupportedTypes>, Array[TSupportedTypes], Map<string|number,TSupportedTypes>

var value = new Map();

value.set(1, 1);

return {
    key: value,
    ...
}
`;

interface IProps {
  onDispatch(): void;
}

export const StateDispatcher: React.FC<IProps> = ({ onDispatch }) => {
  const { activeStore } = useGlobalState();
  const instance = useInstance();

  const [dispatchObj, setDispatchObj] = React.useState();

  return (
    <div css={root}>
      <AceEditor
        mode="javascript"
        theme={
          chrome.devtools.panels.themeName === "dark" ? "monokai" : "xcode"
        }
        value={dispatchObj}
        placeholder={note}
        height="100%"
        width="100%"
        keyboardHandler="vscode"
        fontSize={"1em"}
        onChange={value => setDispatchObj(value)}
        showPrintMargin={false}
        name={`dispatcher_${activeStore}`}
        highlightActiveLine={false}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          tabSize: 4
        }}
      />
      <div css={footer}>
        <Button disabled={!Boolean(dispatchObj)} onClick={dispatch}>
          Dispatch
        </Button>
      </div>
    </div>
  );

  function dispatch() {
    if (
      !instance.storesList.state.list.find(
        storeItem => storeItem.name === activeStore
      ).active
    ) {
      return chrome.devtools.inspectedWindow.eval(
        `console.error("ReactStoreInspector: Can't dispatch to disabled store. Store not exists on page.")`
      );
    }
    try {
      const object = new Function(`return (function() {${dispatchObj}})()`)();
      const state = encodeData({
        $actionName: "@dispatchFromDevTool",
        ...object
      });
      sendDataToPage({
        action: EAction.SET_STATE,
        payload: {
          name: activeStore,
          nextState: state
        }
      });
      onDispatch();
    } catch (e) {
      chrome.devtools.inspectedWindow.eval(
        `console.error("ReactStoreInspector: You try dispatch not a correct state. Please check dispatcher body.")`
      );
    }
  }
};

const root = css`
  padding: 0;
  height: 100%;

  .ace_placeholder {
    transform: scale(1);
    font-family: inherit;
    margin: 0;
    padding: 0;
  }

  .ace_folding-enabled > .ace_gutter-cell {
    padding-right: 6px;
    padding-left: 10px;
  }

  .ace-monokai {
    background: var(--bg-dark-color);

    .ace_gutter {
      background: var(--bg-dark-color);
      border-right: var(--border);
    }
  }
`;

const footer = css`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;
