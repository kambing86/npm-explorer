import { noop } from "lodash";
import React, { useContext, useState, ReactNode } from "react";

const defaultValue = 2;

const ConcurrencyContext = React.createContext<
  [number, React.Dispatch<React.SetStateAction<number>>]
>([defaultValue, noop]);

export const ConcurrencyProvider = ({ children }: { children: ReactNode }) => {
  const contextValue = useState(defaultValue);
  return (
    <ConcurrencyContext.Provider value={contextValue}>
      {children}
    </ConcurrencyContext.Provider>
  );
};

export const useConcurrency = () => {
  return useContext(ConcurrencyContext);
};
