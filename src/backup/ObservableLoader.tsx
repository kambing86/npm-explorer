import React, { useEffect, useState } from "react";
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

function getInitialState<IReturnData>(): IState<IReturnData> {
  return {
    completed: false,
  };
}

function ObservableLoader<IReturnData>({
  observable,
  children,
  onData,
  onError,
  onCompleted,
}: IObservableLoaderProps<IReturnData>) {
  const [state, setState] = useState<IState<IReturnData>>(getInitialState);
  useEffect(() => {
    const subscription = observable.subscribe(
      data => {
        setState(prevState => ({ ...prevState, data }));
        onData && onData(data);
      },
      error => {
        setState(prevState => ({ ...prevState, error }));
        onError && onError(error);
      },
      () => {
        setState(prevState => ({ ...prevState, completed: true }));
        onCompleted && onCompleted();
      }
    );
    return () => {
      setState(getInitialState);
      subscription.unsubscribe();
    };
  }, [observable, onData, onError, onCompleted]);
  return <>{children(state)}</>;
}

export default ObservableLoader;
