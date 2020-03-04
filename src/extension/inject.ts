import { Store, StoreEvent, StoreEventType, StoreOptions } from "react-stores";
import { EAction, TIncomeDispatch, TOutDispatch, ITrace } from "types";
import { encodeData, decodeData } from "utils/encoder";
import * as StackTrace from "stacktrace-js";

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

    this.getStackTrace().then(trace => {
      let currentState = store.getInitialState();
      if (options.persistence) {
        const persistentState = store.persistenceDriver.read().data;

        if (persistentState) {
          currentState = persistentState;
        }
      }

      this.sendDataToDevTools({
        action: EAction.CREATE_NEW_STORE,
        payload: {
          name: name,
          initialState: encodeData(currentState),
          options: options,
          trace,
          meta: {
            persistenceDriverName:
              (store.persistenceDriver as any).__constructorName ??
              Object.getPrototypeOf(store.persistenceDriver)?.constructor?.name,
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
    });
  }

  public updateState(
    name: string,
    nextState: Record<string, any>,
    actionName?: string
  ) {
    this.getStackTrace().then(trace => {
      this.sendDataToDevTools({
        action: EAction.SET_STATE,
        payload: {
          name: name,
          actionName,
          trace,
          nextState: encodeData(nextState)
        }
      });
    });
  }

  public removeStore(storeName: string) {
    this.getStackTrace().then(trace => {
      this.stores.delete(storeName);
      this.sendDataToDevTools({
        action: EAction.REMOVE_STORE,
        payload: {
          trace,
          name: storeName
        }
      });
      this.storesEvents.get(name)?.remove();
      this.storesEvents.delete(name);
    });
  }

  public addEvent(name: string, eventId: number) {
    this.getStackTrace().then(trace => {
      this.sendDataToDevTools({
        action: EAction.ADD_EVENT_LISTENER,
        payload: {
          trace,
          name,
          eventId
        }
      });
    });
  }

  public removeEvent(name: string, eventId: number) {
    this.sendDataToDevTools({
      action: EAction.REMOVE_EVENT_LISTENER,
      payload: {
        name,
        eventId
      }
    });
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

  private getStackTrace(): Promise<ITrace[]> {
    const stackNative = StackTrace.getSync();
    return StackTrace.get().then(stackFrames => {
      return stackNative
        .map((frame, i) => ({ ...frame, sourceMap: stackFrames[i] }))
        .filter(
          frame =>
            [
              "Inspector.attachStore",
              "Inspector.getStackTrace",
              "Inspector.updateState",
              "Inspector.removeStore",
              "t.setState",
              "t.resetStore"
            ].indexOf(frame.functionName) === -1 && frame.fileName
        )
        .map(frame => {
          return {
            line: frame.lineNumber,
            column: frame.columnNumber,
            file: frame.fileName,
            functionName: frame.functionName,
            sourceMap:
              frame.lineNumber === frame.sourceMap.lineNumber &&
              frame.columnNumber === frame.sourceMap.columnNumber
                ? undefined
                : {
                    line: frame.sourceMap.lineNumber,
                    column: frame.sourceMap.columnNumber,
                    file: frame.sourceMap.fileName,
                    functionName: frame.sourceMap.functionName
                  }
          };
        });
    });
  }
}

window["__REACT_STORES_INSPECTOR__"] = new Inspector();
