import { Store, StoreOptions } from "react-stores";
import { TOutDispatch, EAction, THistoryItem, TStoreListItem } from "types";
import { decodeData } from "utils/encoder";

export type TStoreInstance = {
  store: Store<unknown>;
  options: StoreOptions;
  meta: Store<{
    updateTimes: number;
    version: string;
    active: boolean;
  }>;
  history: Store<{
    items: THistoryItem[];
  }>;
};

interface IPageInstance {
  port: chrome.runtime.Port;
  stores: Map<string, TStoreInstance>;
  storesList: Store<{ list: TStoreListItem[] }>;
}

export type TInstances = Map<number, IPageInstance>;

const instances: Map<number, IPageInstance> = new Map();

chrome.runtime.onConnect.addListener(function(port) {
  const tabId = port.sender.tab.id;
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
      if (pageInstance.stores.has(message.payload.name)) {
        const storeInstance = pageInstance.stores.get(message.payload.name);
        storeInstance.meta.setState({
          active: true,
          updateTimes: storeInstance.meta.state.updateTimes + 1
        });
        storeInstance.history.setState({
          items: [
            ...storeInstance.history.state.items,
            {
              action: message.payload.options.persistence
                ? "@initStore/persistence"
                : "@initStore",
              state: { ...store.state },
              payload: {},
              timestamp: Date.now(),
              trace: message.payload.trace
            }
          ]
        });

        pageInstance.storesList.setState({
          list: pageInstance.storesList.state.list.map(storeItem => ({
            ...storeItem,
            active:
              storeItem.name === message.payload.name ? true : storeItem.active
          }))
        });

        return;
      }
      pageInstance.stores.set(message.payload.name, {
        store: store,
        options: message.payload.options,
        history: new Store({
          items: [
            {
              action: message.payload.options.persistence
                ? "@initStore/persistence"
                : "@initStore",
              state: { ...store.state },
              timestamp: Date.now(),
              payload: {},
              trace: message.payload.trace
            }
          ]
        }),
        meta: new Store({
          updateTimes: 0,
          version: message.payload.meta.version,
          active: Boolean(true)
        })
      });
      pageInstance.storesList.setState({
        list: [
          ...pageInstance.storesList.state.list,
          { name: message.payload.name, active: true }
        ]
      });

      break;
    }

    case EAction.REMOVE_STORE: {
      const storeInstance = pageInstance.stores.get(message.payload.name);
      storeInstance.meta.setState({
        active: false
      });
      storeInstance.history.setState({
        items: [
          ...storeInstance.history.state.items,
          {
            action: `@removeStore`,
            state: {},
            payload: {},
            timestamp: Date.now(),
            trace: message.payload.trace
          }
        ]
      });
      pageInstance.storesList.setState({
        list: pageInstance.storesList.state.list.map(storeItem => ({
          ...storeItem,
          active:
            storeItem.name === message.payload.name ? false : storeItem.active
        }))
      });
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
            action:
              message.payload.actionName ??
              `@update/${new Date(Date.now()).toLocaleTimeString()}`,
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
