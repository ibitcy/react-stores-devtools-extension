import { useInstance } from "./useInstance";
import { useGlobalState } from "./useGlobalState";

export const useStoreInstance = () => {
  const { activeStore } = useGlobalState();
  const instance = useInstance();
  return instance.stores.get(activeStore);
};
