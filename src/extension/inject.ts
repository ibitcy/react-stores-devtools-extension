import { Store, StoreEvent, StoreEventType, StoreOptions } from "react-stores";
import { EAction, TIncomeDispatch, TOutDispatch } from "types";
import { encodeData, decodeData } from "utils/encoder";

class Inspector {
  private stores: Map<string, Store<unknown>> = new Map();
  private storesEvents: Map<string, StoreEvent<unknown>> = new Map();

  constructor() {
    window.addEventListener("message", this.postMessageHandler);
  }

  public attachStore(
    store: Store<unknown>,
    name: string,
    options: StoreOptions,
    addEvent: boolean = true
  ) {
    this.stores.set(name, store);

    this.sendDataToDevTools({
      action: EAction.CREATE_NEW_STORE,
      payload: {
        name: name,
        initialState: encodeData(store.getInitialState()),
        options: options,
        meta: {
          version: store.version ?? "?.?.?"
        }
      }
    });
    if (addEvent) {
      this.storesEvents.set(
        name,
        store.on(StoreEventType.Update, state => {
          this.updateState(name, state);
        })
      );
    }
  }

  public updateState(name: string, nextState: Record<string, any>) {
    this.sendDataToDevTools({
      action: EAction.SET_STATE,
      payload: {
        name: name,
        nextState: encodeData(nextState)
      }
    });
  }

  public removeStore(storeName: string) {
    this.stores.delete(storeName);
    this.sendDataToDevTools({
      action: EAction.REMOVE_STORE,
      payload: {
        name: storeName
      }
    });
    this.storesEvents.get(name)?.remove();
    this.storesEvents.delete(name);
  }

  private postMessageHandler = (event: MessageEvent) => {
    if (event.source !== window) {
      return;
    }

    const message = event.data;

    if (
      typeof message !== "object" ||
      message === null ||
      !message.source ||
      message.source !== "react-stores-devtool"
    ) {
      return;
    }

    this.handleMessage(message.data as TIncomeDispatch);
  };

  private sendDataToDevTools(data: TOutDispatch) {
    window.postMessage(
      {
        data,
        source: "react-stores-origin"
      },
      "*"
    );
  }

  private handleMessage(message: TIncomeDispatch) {
    switch (message.action) {
      case EAction.SET_STATE: {
        this.stores
          .get(message.payload.name)
          .setState(decodeData(message.payload.nextState));
        return;
      }
      case EAction.RESET_STATE: {
        this.stores.get(message.payload.name).resetState();
      }
    }
  }
}

window["__REACT_STORES_INSPECTOR__"] = new Inspector();
