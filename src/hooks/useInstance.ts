import { TInstance } from "types";

export const useInstance = () => {
  const { instances } = (window as any).bg as TInstance;
  return instances.get(chrome.devtools.inspectedWindow.tabId);
};
