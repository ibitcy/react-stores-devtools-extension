import { App } from "App";
import { Button } from "components/atoms/Button";
import { Loader } from "components/atoms/Loader";
import { IPagesStore } from "extension/background";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Store } from "react-stores";
import { GlobalProvider } from "GlobalProvider";
import { TIncomeDispatch } from "types";

export type TInstanse = Window & {
  pagesStores: Store<IPagesStore>;
};

let interval = null;

chrome.runtime.getBackgroundPage((instance: TInstanse) => {
  (window as any).bg = instance;

  function checkConnected() {
    const { pagesStores } = instance;
    const connected = pagesStores.state.instances.has(
      chrome.devtools.inspectedWindow.tabId
    );

    if (connected) {
      clearInterval(interval);
      ReactDOM.render(
        <GlobalProvider>
          <App />
        </GlobalProvider>,
        document.getElementById("app")
      );
    } else {
      ReactDOM.render(
        <Loader
          message="Page is not connect"
          postfix={
            <Button
              onClick={() => {
                chrome.devtools.inspectedWindow.reload({});
              }}
            >
              Reload page
            </Button>
          }
        />,
        document.getElementById("app")
      );
      interval = setInterval(checkConnected, 1000);
    }
  }

  checkConnected();
});

window["sendDataToPage"] = (data: TIncomeDispatch) => {
  ((window as any).bg as TInstanse).pagesStores.state.instances
    .get(chrome.devtools.inspectedWindow.tabId)
    .port.postMessage(data);
};
