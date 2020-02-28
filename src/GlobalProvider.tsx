import * as React from "react";

interface IContext {
  activeStore?: string;
  setActiveStore: React.Dispatch<React.SetStateAction<string>>;
}

const initialState = {
  activeStore: null,
  setActiveStore: () => {}
};

export const GlobalContext = React.createContext<IContext>(initialState);

export const GlobalProvider: React.FC<{}> = ({ children }) => {
  const [activeStore, setActiveStore] = React.useState<string>(
    initialState.activeStore
  );

  return (
    <GlobalContext.Provider value={{ activeStore, setActiveStore }}>
      {children}
    </GlobalContext.Provider>
  );
};
