import { useReducer, Reducer } from "react";

function reducer<T>(currentState: T, newState: Partial<T>) {
  return {
    ...currentState,
    ...newState
  };
}

export function useStateSimple<T extends object>(
  initialState: () => T = () => ({} as T)
) {
  return useReducer<Reducer<T, Partial<T>>, T>(reducer, {} as T, initialState);
}
