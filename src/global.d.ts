import { Store } from "react-stores";
import { TIncomeDispatch } from "types";
import { TInstances } from "extension/background";

declare global {
  const bg: Window & {
    instances: TInstances;
  };
  const sendDataToPage: (data: TIncomeDispatch) => void;
}
