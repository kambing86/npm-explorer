import React, { useEffect, useState } from "react";
import { Observable } from "rxjs";

interface ObservableLoaderState<ReturnData> {
  readonly data?: ReturnData;
  readonly error?: Error;
  readonly completed: boolean;
}

export interface ObservableLoaderProps<ReturnData> {
  observable: Observable<ReturnData>;
  children(data: ObservableLoaderState<ReturnData>): React.ReactNode;
  onData?(data: ReturnData): void;
  onError?(err: Error): void;
  onCompleted?(): void;
}

function getInitialState<ReturnData>(): ObservableLoaderState<ReturnData> {
  return {
    completed: false,
  };
}

function ObservableLoader<ReturnData>({
  observable,
  children,
  onData,
  onError,
  onCompleted,
}: ObservableLoaderProps<ReturnData>) {
  const [state, setState] = useState<ObservableLoaderState<ReturnData>>(
    getInitialState,
  );
  useEffect(() => {
    const subscription = observable.subscribe(
      (data) => {
        setState((prevState) => ({ ...prevState, data }));
        onData?.(data);
      },
      (error: Error) => {
        setState((prevState) => ({ ...prevState, error }));
        onError?.(error);
      },
      () => {
        setState((prevState) => ({ ...prevState, completed: true }));
        onCompleted?.();
      },
    );
    return () => {
      setState(getInitialState);
      subscription.unsubscribe();
    };
  }, [observable, onData, onError, onCompleted]);
  return <>{children(state)}</>;
}

export default ObservableLoader;
