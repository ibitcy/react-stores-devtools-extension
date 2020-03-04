import { App } from "App";
import { Button } from "components/atoms/Button";
import { Loader } from "components/atoms/Loader";
import { GlobalProvider } from "GlobalProvider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TIncomeDispatch, TInstance } from "types";

let firstRender = false;

chrome.runtime.getBackgroundPage((bg: TInstance) => {
  (window as any).bg = bg;

  function checkConnected() {
    const connected = bg.instances.has(chrome.devtools.inspectedWindow.tabId);
    if (connected) {
      if (!firstRender) {
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
      }
    } else {
      firstRender = false;
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
      setTimeout(checkConnected, 1000);
    }
  }

  checkConnected();
});

const sendDataToPage = (data: TIncomeDispatch) => {
  ((window as any).bg as TInstance).instances
    .get(chrome.devtools.inspectedWindow.tabId)
    .port.postMessage(data);
};

window["sendDataToPage"] = sendDataToPage;
