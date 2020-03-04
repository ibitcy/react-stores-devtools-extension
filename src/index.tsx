import { App } from "App";
import { Button } from "components/atoms/Button";
import { Loader } from "components/atoms/Loader";
import { GlobalProvider } from "GlobalProvider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TIncomeDispatch, TInstance } from "types";
import { GlobalStyles } from "components/organisms/GlobalStyles";

let appRendered = false;
let waitRendered = false;
const PageNotLoaded = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
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
      />
    </React.Fragment>
  );
};
chrome.runtime.getBackgroundPage((bg: TInstance) => {
  (window as any).bg = bg;

  function checkConnected() {
    const connected = bg.instances.has(chrome.devtools.inspectedWindow.tabId);
    if (connected) {
      if (!appRendered) {
        ReactDOM.render(
          <GlobalProvider>
            <App />
          </GlobalProvider>,
          document.getElementById("app"),
          () => {
            waitRendered = false;
            appRendered = true;
          }
        );
        window.onbeforeunload = function(event) {
          ReactDOM.render(
            <PageNotLoaded />,
            document.getElementById("app"),
            () => {
              waitRendered = true;
            }
          );
        };
      }
    } else {
      if (!waitRendered) {
        ReactDOM.render(
          <PageNotLoaded />,
          document.getElementById("app"),
          () => {
            appRendered = false;
            waitRendered = true;
          }
        );
      }
    }
    setTimeout(checkConnected, 50);
  }

  checkConnected();
});

const sendDataToPage = (data: TIncomeDispatch) => {
  ((window as any).bg as TInstance).instances
    .get(chrome.devtools.inspectedWindow.tabId)
    .port.postMessage(data);
};

window["sendDataToPage"] = sendDataToPage;
