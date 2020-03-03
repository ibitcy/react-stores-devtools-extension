import { App } from "App";
import { Button } from "components/atoms/Button";
import { Loader } from "components/atoms/Loader";
import { TInstances } from "extension/background";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GlobalProvider } from "GlobalProvider";
import { TIncomeDispatch } from "types";

export type TInstanse = Window & {
  instances: TInstances;
};

let interval = null;

chrome.runtime.getBackgroundPage((bg: TInstanse) => {
  (window as any).bg = bg;

  function checkConnected() {
    const connected = bg.instances.has(chrome.devtools.inspectedWindow.tabId);

    if (connected) {
      clearTimeout(interval);
      ReactDOM.render(
        <GlobalProvider>
          <App />
        </GlobalProvider>,
        document.getElementById("app")
      );
      window.onbeforeunload = function(event) {
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
      };
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
      interval = setTimeout(checkConnected, 1000);
    }
  }

  checkConnected();
});

const sendDataToPage = (data: TIncomeDispatch) => {
  ((window as any).bg as TInstanse).instances
    .get(chrome.devtools.inspectedWindow.tabId)
    .port.postMessage(data);
};

window["sendDataToPage"] = sendDataToPage;
