import React, { ReactNode, Reducer, useContext, useReducer } from "react";
import { noop } from "lodash";
import { combineReducers } from "redux";
import { ActionType } from "typesafe-actions";
import { concurrency } from "../state/reducers";
import * as actions from "../state/actions";

function getReducersMap() {
  return {
    concurrency
  };
}

function getInitialState() {
  return combineReducers(getReducersMap())(undefined, actions.INIT());
}

export type GlobalState = ReturnType<typeof getInitialState>;
type Action = ActionType<typeof actions>;

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
