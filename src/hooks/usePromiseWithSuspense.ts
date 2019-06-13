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
  const suspensePromise = useRef<Promise<undefined> | null>(null);
  useEffect(() => {
    if (!promise) {
      return;
    }
    let cleanup = false;
    loading.current = true;
    suspensePromise.current = new Promise(resolve => {
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
    });
    return () => {
      cleanup = true;
      loading.current = false;
      suspensePromise.current = null;
      setState(getInitialState);
    };
  }, [promise]);

  if (loading.current && suspensePromise.current) {
    throw suspensePromise.current;
  }

  return [state, setPromise as Dispatch<SetStateAction<Promise<IReturnData>>>];
}
