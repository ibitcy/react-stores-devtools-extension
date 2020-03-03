# React Stores Devtools Extension

![react-stores](https://ibitcy.github.io/react-stores/react-stores.svg)

Debug your react stores with chrome devtools extension.

- 🔍 Inspect stores current state
- 📜 Check store history step-by-step
- 🔬 Compare diff between states
- 📨 Dispatch state directly from devtools
- 🍔 Clickable stack trace for history and listners
- 🚀 Use in production build
- 📦 Works with isolated stores
- 🎨 Familiar native chrome themes

![screen_light](https://github.com/konstantin24121/react-stores-devtools-extension/example/screen_light.png)

## How to install

- from [Chrome Web Store](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd);
- or build it with `yarn && yarn run build` and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked) `./extension`;

## Demo

Test the extension on [Online demo](https://ibitcy.github.io/react-stores/)

## Usage

You don't have to do anything if you use react-stores@5.\* or higher

### For old versions

> **Note**: Some functions may now work

Start follow you stores with function

```js
const storeOptions = {
  persistence: true
};

const oldStore = new Store4(
  {
    test: "name",
    dateField: Date.now()
  },
  storeOptions
);

window["__REACT_STORES_INSPECTOR__"].attachStore(
  oldStore,
  "Old Store",
  storeOptions
);
```

![screen_dark](https://github.com/konstantin24121/react-stores-devtools-extension/example/screen_dark.png)
