import { useRef, useState } from "react";

function useStateWithRef<S>(
  initialState: S | (() => S),
): [React.MutableRefObject<S>, React.Dispatch<React.SetStateAction<S>>];
function useStateWithRef<S = undefined>(): [
  React.MutableRefObject<S | undefined>,
  React.Dispatch<React.SetStateAction<S | undefined>>,
];

function useStateWithRef<T>(
  initialValue?: T | (() => T),
): [
  React.MutableRefObject<T | undefined>,
  React.Dispatch<React.SetStateAction<T | undefined>>,
] {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);
  stateRef.current = state;
  return [stateRef, setState];
}

export { useStateWithRef };
