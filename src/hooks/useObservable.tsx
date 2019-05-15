import { useReducer, useEffect, Reducer, useState } from "react";
import { Observable } from "rxjs";

interface IState<IReturnData> {
  readonly data?: IReturnData;
  readonly error?: Error;
  readonly completed: boolean;
}

interface IAction {
  type: "data" | "error" | "completed" | "reset";
  payload?: any;
}

function getInitialState<IReturnData>(): IState<IReturnData> {
  return {
    completed: false
  };
}

function reducer<IReturnData>(
  state: IState<IReturnData>,
  action: IAction
): IState<IReturnData> {
  switch (action.type) {
    case "data":
      return { ...state, data: action.payload };
    case "error":
      return { ...state, error: action.payload };
    case "completed":
      return { ...state, completed: true };
    case "reset":
      return getInitialState<IReturnData>();
    default:
      return state;
  }
}

export function useObservable<IReturnData>(): [
  IState<IReturnData>,
  React.Dispatch<React.SetStateAction<Observable<IReturnData> | undefined>>
] {
  const [observable, setObservable] = useState<Observable<IReturnData>>();
  const [state, dispatch] = useReducer<Reducer<IState<IReturnData>, IAction>>(
    reducer,
    getInitialState()
  );
  useEffect(() => {
    if (!observable) {
      return;
    }
    const subscription = observable.subscribe(
      data => {
        dispatch({ type: "data", payload: data });
      },
      error => {
        dispatch({ type: "error", payload: error });
      },
      () => {
        dispatch({ type: "completed" });
      }
    );
    return () => {
      dispatch({ type: "reset" });
      subscription.unsubscribe();
    };
  }, [observable]);

  return [state, setObservable];
}
