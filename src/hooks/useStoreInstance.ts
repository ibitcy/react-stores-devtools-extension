import { useInstance } from "./useInstance";

export const useStoreInstance = (key: string) => {
  const instance = useInstance();
  const store = instance.stores.get(key);

  return store;
};
