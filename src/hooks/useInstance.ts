import { TInstanse } from "../index";
import { useStore } from "react-stores";

export const useInstance = () => {
  const { pagesStores } = (window as any).bg as TInstanse;
  const { instances } = useStore(pagesStores);
  return instances.get(chrome.devtools.inspectedWindow.tabId);
};
