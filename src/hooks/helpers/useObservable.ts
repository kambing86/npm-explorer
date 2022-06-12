import { useState } from "react";
import { Observable } from "rxjs";
import { useEffectOnce } from "./useEffectOnce";
import useStateSimple from "./useStateSimple";

/*
a helper hook to observe an Observable
*/

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

export default function useObservable<ReturnData>(
  initialObservable?: Observable<ReturnData> | (() => Observable<ReturnData>),
): [
  ObserverState<ReturnData>,
  React.Dispatch<React.SetStateAction<Observable<ReturnData>>>,
] {
  const [observable, setObservable] = useState<
    Observable<ReturnData> | undefined
  >(initialObservable);
  const [state, setState] =
    useStateSimple<ObserverState<ReturnData>>(getInitialState);
  useEffectOnce(() => {
    if (!observable) {
      return;
    }
    const subscription = observable.subscribe({
      next(data) {
        setState({ data });
      },
      error(error: Error) {
        setState({ error });
      },
      complete() {
        setState({ completed: true });
      },
    });
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
