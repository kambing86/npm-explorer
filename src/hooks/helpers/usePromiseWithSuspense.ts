import { useEffect, useRef, useState } from "react";

/*
a helper hook to allow Suspense to capture the promise
*/

interface PromiseState<ReturnData> {
  readonly data?: ReturnData;
  readonly error?: Error;
}

function getInitialState<ReturnData>(): PromiseState<ReturnData> {
  return {};
}

export default function usePromiseWithSuspense<ReturnData>(
  initialPromise?: () => Promise<ReturnData>,
): [
  PromiseState<ReturnData>,
  React.Dispatch<React.SetStateAction<Promise<ReturnData>>>,
] {
  const [promise, setPromise] = useState<Promise<ReturnData> | undefined>(
    initialPromise,
  );
  const [state, setState] = useState<PromiseState<ReturnData>>(getInitialState);
  const loading = useRef(false);
  const [suspensePromise, setSuspensePromise] = useState<Promise<void> | null>(
    null,
  );
  useEffect(() => {
    if (!promise) {
      return;
    }
    let cleanup = false;
    loading.current = true;
    setSuspensePromise(
      new Promise((resolve) => {
        promise.then(
          (data: ReturnData) => {
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
          },
        );
      }),
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

  return [
    state,
    setPromise as React.Dispatch<React.SetStateAction<Promise<ReturnData>>>,
  ];
}
