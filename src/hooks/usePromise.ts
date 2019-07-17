import { useEffect, useState, Dispatch, SetStateAction } from "react";

interface PromiseState<ReturnData> {
  readonly data?: ReturnData;
  readonly error?: Error;
  readonly loading: boolean;
}

function getInitialState<ReturnData>(): PromiseState<ReturnData> {
  return {
    loading: true,
  };
}

export function usePromise<ReturnData>(
  initialPromise?: () => Promise<ReturnData>
): [PromiseState<ReturnData>, Dispatch<SetStateAction<Promise<ReturnData>>>] {
  const [promise, setPromise] = useState<Promise<ReturnData> | undefined>(
    initialPromise
  );
  const [state, setState] = useState<PromiseState<ReturnData>>(getInitialState);
  useEffect(() => {
    if (!promise) {
      return;
    }
    let cleanup = false;
    promise.then(
      (data: ReturnData) => {
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
      setState(getInitialState);
    };
  }, [promise]);

  return [state, setPromise as Dispatch<SetStateAction<Promise<ReturnData>>>];
}
