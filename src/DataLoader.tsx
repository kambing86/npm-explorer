import React, { Component } from "react";

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

export class DataLoader<IReturnData> extends Component<
  IDataLoaderProps<IReturnData>,
  IState<IReturnData>
> {
  private static readonly initialState = {
    data: undefined,
    error: undefined,
    loading: true
  };
  public readonly state: IState<IReturnData> = DataLoader.initialState;
  private cacheKey?: string;
  private unmounted = false;

  public render() {
    return this.props.children(this.state);
  }

  public componentDidMount() {
    const { cacheKey, createPromise } = this.props;
    this.loadData(cacheKey, createPromise);
  }

  public componentDidUpdate(prevProps: IDataLoaderProps<IReturnData>) {
    const { cacheKey, createPromise, onCompleted, onError } = this.props;
    if (prevProps.cacheKey !== cacheKey) {
      this.setState(DataLoader.initialState, () => {
        this.loadData(cacheKey, createPromise);
      });
    } else if (onCompleted || onError) {
      const { data, error, loading } = this.state;
      if (!loading) {
        // data can be null
        if (onCompleted && !error && data !== undefined) {
          onCompleted(data);
        } else if (onError && error) {
          onError(error);
        }
      }
    }
  }

  public componentWillUnmount() {
    this.unmounted = true;
  }

  private loadData(
    cacheKey: string,
    createPromise: IDataLoaderProps<IReturnData>["createPromise"]
  ) {
    this.cacheKey = cacheKey;
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
        if (!this.unmounted && this.cacheKey === cacheKey) {
          this.setState({ data, loading: false });
        }
      })
      .catch(error => {
        if (!this.unmounted && this.cacheKey === cacheKey) {
          this.setState({ error, loading: false });
        }
      });
  }
}
