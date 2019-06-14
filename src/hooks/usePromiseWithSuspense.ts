import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";

interface IPromiseState<IReturnData> {
  readonly data?: IReturnData;
  readonly error?: Error;
}

function getInitialState<IReturnData>(): IPromiseState<IReturnData> {
  return {};
}

export function usePromiseWithSuspense<IReturnData>(
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
  const loading = useRef(false);
  const [suspensePromise, setSuspensePromise] = useState<Promise<
    undefined
  > | null>(null);
  useEffect(() => {
    if (!promise) {
      return;
    }
    let cleanup = false;
    loading.current = true;
    setSuspensePromise(
      new Promise(resolve => {
        promise.then(
          (data: IReturnData) => {
            if (!cleanup) {
              loading.current = false;
              setState({ data });
            }
            resolve();
          },
          (error: Error) => {
            if (!cleanup) {
              loading.current = false;
              setState({ error });
            }
            resolve();
          }
        );
      })
    );
    return () => {
      cleanup = true;
      loading.current = false;
      setSuspensePromise(null);
      setState(getInitialState);
    };
  }, [promise]);

  if (loading.current && suspensePromise) {
    throw suspensePromise;
  }

  return [state, setPromise as Dispatch<SetStateAction<Promise<IReturnData>>>];
}
