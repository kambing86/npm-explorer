import { useEffect, useState } from "react";
import { Observable } from "rxjs";
import { useStateSimple } from "./useStateSimple";

interface ObserverState<ReturnData> {
  readonly data?: ReturnData;
  readonly error?: Error;
  readonly completed: boolean;
}

function getInitialState<ReturnData>(): ObserverState<ReturnData> {
  return {
    data: undefined,
    error: undefined,
    completed: false,
  };
}

export function useObservable<ReturnData>(
  initialObservable?: Observable<ReturnData> | (() => Observable<ReturnData>),
): [
  ObserverState<ReturnData>,
  React.Dispatch<React.SetStateAction<Observable<ReturnData>>>,
] {
  const [observable, setObservable] = useState<
    Observable<ReturnData> | undefined
  >(initialObservable);
  const [state, setState] = useStateSimple<ObserverState<ReturnData>>(
    getInitialState,
  );
  useEffect(() => {
    if (!observable) {
      return;
    }
    const subscription = observable.subscribe(
      (data) => {
        setState({ data });
      },
      (error) => {
        setState({ error });
      },
      () => {
        setState({ completed: true });
      },
    );
    return () => {
      setState(getInitialState());
      subscription.unsubscribe();
    };
  }, [observable, setState]);

  return [
    state,
    setObservable as React.Dispatch<
      React.SetStateAction<Observable<ReturnData>>
    >,
  ];
}
