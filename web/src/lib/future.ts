import { Entities } from './entities';

export interface FutureLoading {
  isLoading: boolean;
  // TODO: Loading progress, loading step, etc.
}

export interface FutureState {
  error: Error | null;
  loading: FutureLoading | null;
}

export type IFuture<T> = [T | null, FutureState];

export const emptyFuture = (): IFuture<null> => [
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
  let loading: FutureLoading | null = null;
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
  entities: Entities<IFuture<T>>,
): IFuture<Entities<T | null>> => {
  let error: Error | null = null;
  let loading: FutureLoading | null = null;
  const value: Entities<T | null> = {};

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
