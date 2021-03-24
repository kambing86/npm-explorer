import { noop } from "lodash";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

const defaultValue = 2;

const ConcurrencyContext = createContext<
  [number, Dispatch<SetStateAction<number>>]
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
