import { noop } from "lodash";
import React, { useContext, useReducer } from "react";
import { getInitialState, getReducers } from "store";
import { Action, GlobalState } from "store/types";

function reducer(state: GlobalState, action: Action) {
  return getReducers()(state, action);
}

const GlobalStateContext = React.createContext<
  [GlobalState, React.Dispatch<Action>]
>([getInitialState(), noop]);

export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const contextValue = useReducer<React.Reducer<GlobalState, Action>, null>(
    reducer,
    null,
    getInitialState,
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

export function useSelector<T>(selector: (state: GlobalState) => T) {
  const [state] = useGlobalState();
  return selector(state);
}

export function useDispatch() {
  const globalState = useGlobalState();
  return globalState[1];
}
