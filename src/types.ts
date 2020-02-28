import { StoreOptions } from "react-stores";

export enum EAction {
  SET_STATE,
  RESET_STATE,
  CREATE_NEW_STORE,
  REMOVE_STORE
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
        meta: {
          version: string;
        };
      };
    }
  | {
      action: EAction.SET_STATE;
      payload: {
        name: string;
        actionName?: string;
        nextState: string;
      };
    }
  | {
      action: EAction.REMOVE_STORE;
      payload: {
        name: string;
      };
    };
