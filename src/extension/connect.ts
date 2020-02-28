function injectScript() {
  let s = document.createElement("script");
  const script = require("raw-loader!../../tmp/inject.js").default;
  s.appendChild(document.createTextNode(script));
  (document.head || document.documentElement).appendChild(s);
  s.parentNode.removeChild(s);
}

const backgroundPageConnection = chrome.runtime.connect({
  name: "page"
});

backgroundPageConnection.onMessage.addListener(function(message) {
  window.postMessage(
    {
      data: message,
      source: "react-stores-devtool"
    },
    "*"
  );
});

window.addEventListener("message", function(event) {
  if (event.source !== window) {
    return;
  }

  const message = event.data;

  if (
    typeof message !== "object" ||
    message === null ||
    !message.source ||
    message.source !== "react-stores-origin"
  ) {
    return;
  }

  try {
    backgroundPageConnection.postMessage(message.data);
  } catch (e) {}
});

injectScript();
