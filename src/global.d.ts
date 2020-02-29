import { Store } from "react-stores";
import { IPagesStore } from "extension/background";
import { TIncomeDispatch } from "types";

declare global {
  const bg: Window & {
    pagesStores: Store<IPagesStore>;
  };
  const sendDataToPage: (data: TIncomeDispatch) => void;
}
