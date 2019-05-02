import React, { useState, useEffect } from "react";
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

function ObservableLoader<IReturnData>({
  observable,
  children
}: IObservableLoaderProps<IReturnData>): React.ReactElement {
  const [data, setData] = useState<IState<IReturnData>["data"]>();
  const [error, setError] = useState<IState<IReturnData>["error"]>();
  const [completed, setCompleted] = useState<IState<IReturnData>["completed"]>(
    false
  );
  useEffect(() => {
    const subscription = observable.subscribe(
      data => setData(data),
      error => setError(error),
      () => setCompleted(true)
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [observable]);
  return <>{children({ data, error, completed })}</>;
}

export default ObservableLoader;
