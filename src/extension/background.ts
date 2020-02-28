import { Store, StoreOptions } from "react-stores";
import { TOutDispatch, EAction } from "types";
import { decodeData } from "utils/encoder";

type THistoryItem = {
  action: string;
  state: Record<any, any>;
  payload: Record<any, any>;
  timestamp: number;
};

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
}

export interface IPagesStore {
  instances: Map<number, IPageInstance>;
}

const pagesStores = new Store<IPagesStore>({
  instances: new Map()
});

chrome.runtime.onConnect.addListener(function(port) {
  const tabId = port.sender.tab.id;
  const nextMap = new Map(pagesStores.state.instances);
  nextMap.set(tabId, {
    port,
    stores: new Map()
  });

  pagesStores.setState({
    instances: nextMap
  });

  port.onMessage.addListener(messageHandler);

  port.onDisconnect.addListener(function(port) {
    port.onMessage.removeListener(messageHandler);
    const nextMap = new Map(pagesStores.state.instances);
    nextMap.delete(tabId);
    pagesStores.setState({
      instances: nextMap
    });
  });
});

const messageHandler = function(
  message: TOutDispatch,
  port: chrome.runtime.Port
) {
  const nextMap = new Map(pagesStores.state.instances);
  const nextInstance = nextMap.get(port.sender.tab.id);
  const nextStores = new Map(nextInstance.stores);
  let update = true;

  switch (message.action) {
    case EAction.CREATE_NEW_STORE: {
      const store = new Store(decodeData(message.payload.initialState));
      nextStores.set(message.payload.name, {
        store: new Store(decodeData(message.payload.initialState)),
        options: message.payload.options,
        history: new Store({
          items: [
            {
              action: "@init",
              state: { ...store.state },
              timestamp: Date.now(),
              payload: {}
            }
          ]
        }),
        meta: new Store({
          updateTimes: 0,
          version: message.payload.meta.version
        })
      });
      break;
    }

    case EAction.REMOVE_STORE: {
      nextStores.delete(message.payload.name);
      break;
    }

    case EAction.SET_STATE: {
      const nextState = decodeData(message.payload.nextState);
      const storeInstance = nextStores.get(message.payload.name);

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
            timestamp: Date.now()
          }
        ]
      });

      update = false;
      break;
    }

    default: {
      update = false;
    }
  }
  if (update) {
    nextInstance.stores = nextStores;
    nextMap.set(port.sender.tab.id, nextInstance);

    pagesStores.setState({
      instances: nextMap
    });
  }
};

window["pagesStores"] = pagesStores;
