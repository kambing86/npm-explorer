import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Observable } from "rxjs";
import { useStateSimple } from "./useStateSimple";

interface IObserverState<IReturnData> {
  readonly data?: IReturnData;
  readonly error?: Error;
  readonly completed: boolean;
}

function getInitialState<IReturnData>(): IObserverState<IReturnData> {
  return {
    data: undefined,
    error: undefined,
    completed: false,
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
  const [state, setState] = useStateSimple<IObserverState<IReturnData>>(
    getInitialState
  );
  useEffect(() => {
    if (!observable) {
      return;
    }
    const subscription = observable.subscribe(
      data => {
        setState({ data });
      },
      error => {
        setState({ error });
      },
      () => {
        setState({ completed: true });
      }
    );
    return () => {
      setState(getInitialState());
      subscription.unsubscribe();
    };
  }, [observable, setState]);

  return [
    state,
    setObservable as Dispatch<SetStateAction<Observable<IReturnData>>>,
  ];
}
