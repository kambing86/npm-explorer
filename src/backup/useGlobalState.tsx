import { noop } from "lodash";
import {
  Dispatch,
  ReactNode,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from "react";
import { getInitialState, getReducers } from "store";
import { Action, GlobalState } from "store/types";

function reducer(state: GlobalState, action: Action) {
  return getReducers()(state, action);
}

const GlobalStateContext = createContext<[GlobalState, Dispatch<Action>]>([
  getInitialState(),
  noop,
]);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const contextValue = useReducer<Reducer<GlobalState, Action>, null>(
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
