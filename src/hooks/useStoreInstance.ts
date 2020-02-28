import { useInstance } from "./useInstance";
import { useStore } from "react-stores";

export const useStoreInstance = (key: string) => {
  const instance = useInstance();
  const store = instance.stores.get(key);
  useStore(store.store);

  return store;
};
