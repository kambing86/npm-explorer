import React, { ReactNode, useReducer, useContext } from "react";
import { noop } from "lodash";

interface IState {
  concurrency: number;
}

interface IAction {
  type: "set";
  payload: number;
}

const initialState: IState = {
  concurrency: 2
};

const ConcurrencyContext = React.createContext<
  [IState, React.Dispatch<IAction>]
>([initialState, noop]);

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case "set":
      return { concurrency: action.payload };
    default:
      return state;
  }
}

export const ConcurrencyProvider = ({ children }: { children: ReactNode }) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <ConcurrencyContext.Provider value={contextValue}>
      {children}
    </ConcurrencyContext.Provider>
  );
};

export const useConcurrency = () => {
  return useContext(ConcurrencyContext);
};
