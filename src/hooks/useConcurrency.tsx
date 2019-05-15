import React, { ReactNode, useContext, useState } from "react";
import { noop } from "lodash";

const defaultValue = 2;

const ConcurrencyContext = React.createContext<
  [number, React.Dispatch<React.SetStateAction<number>>]
>([defaultValue, noop]);

export const ConcurrencyProvider = ({ children }: { children: ReactNode }) => {
  const contextValue = useState(2);
  return (
    <ConcurrencyContext.Provider value={contextValue}>
      {children}
    </ConcurrencyContext.Provider>
  );
};

export const useConcurrency = () => {
  return useContext(ConcurrencyContext);
};
