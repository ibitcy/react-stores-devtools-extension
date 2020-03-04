import { Store } from "react-stores";
import { TIncomeDispatch, TInstances } from "types";

declare global {
  const bg: Window & {
    instances: TInstances;
  };
  const sendDataToPage: (data: TIncomeDispatch) => void;
}
