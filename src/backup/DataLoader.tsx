import React, { useEffect, useRef, useState } from "react";

interface DataCache {
  [cacheKey: string]: Promise<unknown> | undefined;
}

const dataCaches: DataCache = {};

export interface DataLoaderProps<ReturnData> {
  cacheKey: string;
  createPromise(): Promise<ReturnData>;
  children(data: DataLoaderState<ReturnData>): React.ReactNode;
  onCompleted?(data: ReturnData): void;
  onError?(err: Error): void;
}

interface DataLoaderState<ReturnData> {
  readonly data?: ReturnData;
  readonly error?: Error;
  readonly loading: boolean;
}

function getInitialState<ReturnData>(): DataLoaderState<ReturnData> {
  return {
    loading: true,
  };
}

export function DataLoader<ReturnData>({
  cacheKey,
  createPromise,
  children,
  onCompleted,
  onError,
}: DataLoaderProps<ReturnData>) {
  const [state, setState] = useState<DataLoaderState<ReturnData>>(
    getInitialState,
  );
  const [currentCacheKey, setCurrentCacheKey] = useState<string>();
  const createPromiseRef = useRef(createPromise);
  createPromiseRef.current = createPromise;
  useEffect(() => {
    if (cacheKey !== currentCacheKey) {
      setState(getInitialState);
      setCurrentCacheKey(cacheKey);
    } else {
      let cleanup = false;
      let foundCache = dataCaches[cacheKey];

      if (!foundCache) {
        const promise = createPromiseRef
          .current()
          .then((res) => {
            delete dataCaches[cacheKey];
            return res;
          })
          .catch((err: Error) => {
            delete dataCaches[cacheKey];
            throw err;
          });
        dataCaches[cacheKey] = foundCache = promise;
      }

      foundCache
        .then((unknownData) => {
          if (!cleanup) {
            setState({ data: unknownData as ReturnData, loading: false });
          }
        })
        .catch((error: Error) => {
          if (!cleanup) {
            setState({ error, loading: false });
          }
        });

      return () => {
        cleanup = true;
      };
    }
  }, [cacheKey, currentCacheKey]);
  useEffect(() => {
    if (onCompleted || onError) {
      const { data, error, loading } = state;
      if (!loading) {
        // data can be null
        if (error) {
          onError?.(error);
        } else if (data !== undefined) {
          onCompleted?.(data);
        }
      }
    }
  }, [state, onCompleted, onError]);
  return <>{children(state)}</>;
}
