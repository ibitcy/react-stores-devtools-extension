import { useContext } from "react";
import { GlobalContext } from "GlobalProvider";

export const useGlobalState = () => {
  return useContext(GlobalContext);
};
