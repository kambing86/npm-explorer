import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Observable } from "rxjs";

interface IObserverState<IReturnData> {
  readonly data?: IReturnData;
  readonly error?: Error;
  readonly completed: boolean;
}

function getInitialState<IReturnData>(): IObserverState<IReturnData> {
  return {
    completed: false
  };
}

export function useObservable<IReturnData>(
  initialObservable?: Observable<IReturnData> | (() => Observable<IReturnData>)
): [
  IObserverState<IReturnData>,
  Dispatch<SetStateAction<Observable<IReturnData>>>
] {
  const [observable, setObservable] = useState<
    Observable<IReturnData> | undefined
  >(initialObservable);
  const [state, setState] = useState<IObserverState<IReturnData>>(
    getInitialState
  );
  useEffect(() => {
    if (!observable) {
      return;
    }
    const subscription = observable.subscribe(
      data => {
        setState(prevState => ({ ...prevState, data }));
      },
      error => {
        setState(prevState => ({ ...prevState, error }));
      },
      () => {
        setState(prevState => ({ ...prevState, completed: true }));
      }
    );
    return () => {
      setState(getInitialState());
      subscription.unsubscribe();
    };
  }, [observable]);

  return [
    state,
    setObservable as Dispatch<SetStateAction<Observable<IReturnData>>>
  ];
}
