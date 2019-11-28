import { useRef, useState } from "react";

export const useStateWithRef = <T>(
  initialValue: T,
): [React.MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);
  stateRef.current = state;
  return [stateRef, setState];
};
