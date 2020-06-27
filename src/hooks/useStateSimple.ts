import { useReducer } from "react";

function reducer<T>(currentState: T, newState: Partial<T>) {
  return {
    ...currentState,
    ...newState,
  };
}

export function useStateSimple<T extends unknown>(initialState: () => T) {
  return useReducer<React.Reducer<T, Partial<T>>, null>(
    reducer,
    null,
    initialState,
  );
}
