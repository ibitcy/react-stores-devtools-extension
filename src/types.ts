import { StoreOptions } from "react-stores";

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
  ADD_EVENT_LISTNER,
  REMOVE_EVENT_LISTNER
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
      action: EAction.ADD_EVENT_LISTNER;
      payload: {
        trace: ITrace[];
        name: string;
        eventId: number;
      };
    }
  | {
      action: EAction.REMOVE_EVENT_LISTNER;
      payload: {
        name: string;
        eventId: number;
      };
    };
