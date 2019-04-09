import { IEntities } from './entities';

export interface IFutureLoading {
  isLoading: boolean;
  // TODO: Loading progress, loading step, etc.
}

export interface IFutureState {
  error: Error | null;
  loading: IFutureLoading | null;
}

export type IFuture<T> = [T | null, IFutureState];

export const emptyFuture = (): IFuture<any> => [
  null,
  {
    error: null,
    loading: null,
  },
];

export const errorFuture = <T>(error: Error): IFuture<T> => [
  null,
  {
    error,
    loading: null,
  },
];

export const loadingFuture = <T>(currentFuture?: IFuture<T>): IFuture<T> => [
  currentFuture ? currentFuture[0] : null,
  {
    error: null,
    loading: { isLoading: true },
  },
];

export const valueFuture = <T>(value: T): IFuture<T> => [
  value,
  {
    error: null,
    loading: null,
  },
];

export const flatFutures = <T>(
  futures: (IFuture<T>)[],
): IFuture<(T | null)[]> => {
  let error: Error | null = null;
  let loading: IFutureLoading | null = null;
  const value = futures.map(
    ([futureValue, { error: futureError, loading: futureLoading }]) => {
      if (futureLoading) {
        loading = futureLoading;
      }
      if (!error && futureError) {
        error = futureError;
      }
      return futureValue;
    },
  );

  return [
    value,
    {
      error,
      loading,
    },
  ];
};

export const flatFutureEntities = <T>(
  entities: IEntities<IFuture<T>>,
): IFuture<IEntities<T | null>> => {
  let error: Error | null = null;
  let loading: IFutureLoading | null = null;
  const value: IEntities<T | null> = {};

  Object.keys(entities).forEach(id => {
    const [
      futureValue,
      { error: futureError, loading: futureLoading },
    ] = entities[id];
    if (futureLoading) {
      loading = futureLoading;
    }
    if (!error && futureError) {
      error = futureError;
    }
    value[id] = futureValue;
  });

  return [
    value,
    {
      error,
      loading,
    },
  ];
};
