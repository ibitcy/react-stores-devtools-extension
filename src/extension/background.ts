import { Store, StoreOptions } from "react-stores";
import { TOutDispatch, EAction } from "types";
import { decodeData } from "utils/encoder";

export type TStoreInstance = {
  store: Store<unknown>;
  options: StoreOptions;
  meta: Store<{
    updateTimes: number;
    version: string;
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
      nextStores.set(message.payload.name, {
        store: new Store(decodeData(message.payload.initialState)),
        options: message.payload.options,
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
      const nextStore = nextStores.get(message.payload.name);
      nextStore.store.setState(decodeData(message.payload.nextState));
      nextStore.meta.setState({
        updateTimes: nextStore.meta.state.updateTimes + 1
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
