import React, { ReactNode, Reducer, useContext, useReducer } from "react";
import { noop } from "lodash";
import { combineReducers } from "redux";
import { concurrency } from "../state/reducers";
import { INIT } from "../state/actions";
import { Action } from "../state/types";

function getReducersMap() {
  return {
    concurrency
  };
}

function getInitialState() {
  return combineReducers(getReducersMap())(undefined, INIT());
}

export type GlobalState = ReturnType<typeof getInitialState>;

function reducer(state: GlobalState, action: Action) {
  return combineReducers(getReducersMap())(state, action);
}

const GlobalStateContext = React.createContext<
  [GlobalState, React.Dispatch<Action>]
>([getInitialState(), noop]);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const contextValue = useReducer<Reducer<GlobalState, Action>, null>(
    reducer,
    null,
    getInitialState
  );
  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
