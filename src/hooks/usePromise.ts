import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface IPromiseState<IReturnData> {
  readonly data?: IReturnData;
  readonly error?: Error;
  readonly loading: boolean;
}

function getInitialState<IReturnData>(): IPromiseState<IReturnData> {
  return {
    loading: true
  };
}

export function usePromise<IReturnData>(
  initialPromise?: () => Promise<IReturnData>
): [
  IPromiseState<IReturnData>,
  Dispatch<SetStateAction<Promise<IReturnData>>>
] {
  const [promise, setPromise] = useState<Promise<IReturnData> | undefined>(
    initialPromise
  );
  const [state, setState] = useState<IPromiseState<IReturnData>>(
    getInitialState
  );
  useEffect(() => {
    if (!promise) {
      return;
    }
    let cleanup = false;
    promise.then(
      (data: IReturnData) => {
        if (!cleanup) {
          setState({ data, loading: false });
        }
      },
      (error: Error) => {
        if (!cleanup) {
          setState({ error, loading: false });
        }
      }
    );
    return () => {
      cleanup = true;
      setState(getInitialState());
    };
  }, [promise]);

  return [state, setPromise as Dispatch<SetStateAction<Promise<IReturnData>>>];
}
