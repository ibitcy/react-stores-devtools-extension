import { Store, StoreOptions } from "react-stores";

export type TStoreInstance = {
  store: Store<unknown>;
  options: StoreOptions & {
    persistenceDriver: string;
  };
  meta: Store<{
    updateTimes: number;
    version: string;
    active: boolean;
    listenersNumber: number;
  }>;
  history: Store<{
    items: THistoryItem[];
  }>;
  listeners: Store<{
    list: TListener[];
  }>;
};

export interface IPageInstance {
  port: chrome.runtime.Port;
  stores: Map<string, TStoreInstance>;
  storesList: Store<{ list: TStoreListItem[] }>;
}

export type TInstances = Map<number, IPageInstance>;

export type TInstance = Window & {
  instances: TInstances;
};

export interface ITrace {
  line: number;
  column: number;
  file: string;
  functionName: string;
  sourceMap?: Omit<ITrace, "sourceMap">;
}

export type TStoreListItem = {
  name: string;
  active: boolean;
};

export type THistoryItem = {
  action: string;
  state: Record<any, any>;
  payload: Record<any, any>;
  timestamp: number;
  trace: ITrace[];
};

export type TListener = {
  id: number;
  trace: ITrace[];
};

export enum EAction {
  SET_STATE,
  RESET_STATE,
  CREATE_NEW_STORE,
  REMOVE_STORE,
  ADD_EVENT_LISTENER,
  REMOVE_EVENT_LISTENER,
  RELOAD
}

export type TIncomeDispatch =
  | {
      action: EAction.SET_STATE;
      payload: {
        name: string;
        actionName?: string;
        nextState: string;
      };
    }
  | {
      action: EAction.RESET_STATE;
      payload: {
        name: string;
      };
    };

export type TOutDispatch =
  | {
      action: EAction.CREATE_NEW_STORE;
      payload: {
        name: string;
        initialState: string;
        options: StoreOptions;
        trace: ITrace[];
        meta: {
          version: string;
          persistenceDriverName: string;
        };
      };
    }
  | {
      action: EAction.SET_STATE;
      payload: {
        name: string;
        trace: ITrace[];
        actionName?: string;
        nextState: string;
      };
    }
  | {
      action: EAction.REMOVE_STORE;
      payload: {
        trace: ITrace[];
        name: string;
      };
    }
  | {
      action: EAction.ADD_EVENT_LISTENER;
      payload: {
        trace: ITrace[];
        name: string;
        eventId: number;
      };
    }
  | {
      action: EAction.REMOVE_EVENT_LISTENER;
      payload: {
        name: string;
        eventId: number;
      };
    }
  | {
      action: EAction.RELOAD;
    };
