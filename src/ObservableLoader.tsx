import React, { useReducer, useEffect, Reducer } from "react";
import { Observable } from "rxjs";

interface IState<IReturnData> {
  readonly data?: IReturnData;
  readonly error?: Error;
  readonly completed: boolean;
}

export interface IObservableLoaderProps<IReturnData> {
  observable: Observable<IReturnData>;
  children(data: IState<IReturnData>): React.ReactNode;
  onData?(data: IReturnData): void;
  onError?(err: Error): void;
  onCompleted?(): void;
}

interface IAction {
  type: "data" | "error" | "completed";
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
    default:
      return state;
  }
}

function ObservableLoader<IReturnData>({
  observable,
  children,
  onData,
  onError,
  onCompleted
}: IObservableLoaderProps<IReturnData>) {
  const [state, dispatch] = useReducer<Reducer<IState<IReturnData>, IAction>>(
    reducer,
    getInitialState()
  );
  useEffect(() => {
    const subscription = observable.subscribe(
      data => {
        dispatch({ type: "data", payload: data });
        onData && onData(data);
      },
      error => {
        dispatch({ type: "error", payload: error });
        onError && onError(error);
      },
      () => {
        dispatch({ type: "completed" });
        onCompleted && onCompleted();
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [observable, onData, onError, onCompleted]);
  return <>{children(state)}</>;
}

export default ObservableLoader;
