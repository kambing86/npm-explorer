import React, { useEffect, useState } from "react";

interface IDataCache {
  // tslint:disable-next-line no-any
  [cacheKey: string]: Promise<any> | undefined;
}

const dataCaches: IDataCache = {};

export interface IDataLoaderProps<IReturnData> {
  cacheKey: string;
  createPromise(): Promise<IReturnData>;
  children(data: IState<IReturnData>): React.ReactNode;
  onCompleted?(data: IReturnData): void;
  onError?(err: Error): void;
}

interface IState<IReturnData> {
  readonly data?: IReturnData;
  readonly error?: Error;
  readonly loading: boolean;
}

function getInitialState<IReturnData>(): IState<IReturnData> {
  return {
    loading: true,
  };
}

export function DataLoader<IReturnData>({
  cacheKey,
  createPromise,
  children,
  onCompleted,
  onError,
}: IDataLoaderProps<IReturnData>) {
  const [state, setState] = useState<IState<IReturnData>>(getInitialState);
  const [currentCacheKey, setCurrentCacheKey] = useState<string>();
  useEffect(() => {
    if (cacheKey !== currentCacheKey) {
      setState(getInitialState);
      setCurrentCacheKey(cacheKey);
    } else {
      let cleanup = false;
      let foundCache = dataCaches[cacheKey];

      if (!foundCache) {
        const promise = createPromise()
          .then(res => {
            delete dataCaches[cacheKey];
            return res;
          })
          .catch(err => {
            delete dataCaches[cacheKey];
            throw err;
          });
        dataCaches[cacheKey] = foundCache = promise;
      }

      foundCache
        .then((data: IReturnData) => {
          if (!cleanup) {
            setState({ data, loading: false });
          }
        })
        .catch(error => {
          if (!cleanup) {
            setState({ error, loading: false });
          }
        });

      return () => {
        cleanup = true;
      };
    }
  }, [cacheKey, currentCacheKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (onCompleted || onError) {
      const { data, error, loading } = state;
      if (!loading) {
        // data can be null
        if (onCompleted && !error && data !== undefined) {
          onCompleted(data);
        } else if (onError && error) {
          onError(error);
        }
      }
    }
  }, [state, onCompleted, onError]);
  return <>{children(state)}</>;
}
