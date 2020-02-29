import { TInstanse } from "../index";

export const useInstance = () => {
  const { instances } = (window as any).bg as TInstanse;
  return instances.get(chrome.devtools.inspectedWindow.tabId);
};
