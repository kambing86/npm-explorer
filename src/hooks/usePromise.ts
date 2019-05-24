import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface IState<IReturnData> {
  readonly data?: IReturnData;
  readonly error?: Error;
  readonly loading: boolean;
}

function getInitialState<IReturnData>(): IState<IReturnData> {
  return {
    loading: true
  };
}

export function usePromise<IReturnData>(): [
  IState<IReturnData>,
  Dispatch<SetStateAction<Promise<IReturnData>>>
] {
  const [promise, setPromise] = useState<Promise<IReturnData>>();
  const [state, setState] = useState<IState<IReturnData>>(getInitialState());
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
