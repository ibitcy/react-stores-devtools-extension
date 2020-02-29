import { Store, StoreOptions } from "react-stores";
import { TOutDispatch, EAction, THistoryItem } from "types";
import { decodeData } from "utils/encoder";

export type TStoreInstance = {
  store: Store<unknown>;
  options: StoreOptions;
  meta: Store<{
    updateTimes: number;
    version: string;
  }>;
  history: Store<{
    items: THistoryItem[];
  }>;
};

interface IPageInstance {
  port: chrome.runtime.Port;
  stores: Map<string, TStoreInstance>;
  storesList: Store<{ list: string[] }>;
}

export type TInstances = Map<number, IPageInstance>;

const instances: Map<number, IPageInstance> = new Map();

chrome.runtime.onConnect.addListener(function(port) {
  const tabId = port.sender.tab.id;
  console.log("add listener");
  instances.set(tabId, {
    port,
    stores: new Map(),
    storesList: new Store({ list: [] })
  });

  port.onMessage.addListener(messageHandler);

  port.onDisconnect.addListener(function(port) {
    port.onMessage.removeListener(messageHandler);
    instances.delete(tabId);
  });
});

const messageHandler = function(
  message: TOutDispatch,
  port: chrome.runtime.Port
) {
  const pageInstance = instances.get(port.sender.tab.id);

  switch (message.action) {
    case EAction.CREATE_NEW_STORE: {
      const store = new Store(decodeData(message.payload.initialState));

      pageInstance.stores.set(message.payload.name, {
        store: new Store(decodeData(message.payload.initialState)),
        options: message.payload.options,
        history: new Store({
          items: [
            {
              action: "@init",
              state: { ...store.state },
              timestamp: Date.now(),
              payload: {},
              trace: message.payload.trace
            }
          ]
        }),
        meta: new Store({
          updateTimes: 0,
          version: message.payload.meta.version
        })
      });
      pageInstance.storesList.setState({
        list: [...pageInstance.storesList.state.list, message.payload.name]
      });
      break;
    }

    case EAction.REMOVE_STORE: {
      pageInstance.storesList.setState({
        list: [...pageInstance.storesList.state.list, message.payload.name]
      });
      pageInstance.stores.delete(message.payload.name);
      break;
    }

    case EAction.SET_STATE: {
      const nextState = decodeData(message.payload.nextState);
      const storeInstance = pageInstance.stores.get(message.payload.name);

      storeInstance.store.setState(nextState);
      storeInstance.meta.setState({
        updateTimes: storeInstance.meta.state.updateTimes + 1
      });
      storeInstance.history.setState({
        items: [
          ...storeInstance.history.state.items,
          {
            action: message.payload.actionName ?? `@update_${Date.now()}`,
            state: { ...(storeInstance.store.state as any) },
            payload: nextState,
            timestamp: Date.now(),
            trace: message.payload.trace
          }
        ]
      });

      break;
    }
  }
};

window["instances"] = instances;
