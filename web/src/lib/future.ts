import { Entities } from './entities';

export interface FutureLoading {
  isLoading: boolean;
  // TODO: Loading progress, loading step, etc.
}

export interface FutureState {
  error: Error | null;
  loading: FutureLoading | null;
}

export type Future<T> = [T | null, FutureState];

export const emptyFuture = (): Future<null> => [
  null,
  {
    error: null,
    loading: null,
  },
];

export const errorFuture = <T>(error: Error): Future<T> => [
  null,
  {
    error,
    loading: null,
  },
];

export const loadingFuture = <T>(currentFuture?: Future<T>): Future<T> => [
  currentFuture ? currentFuture[0] : null,
  {
    error: null,
    loading: { isLoading: true },
  },
];

export const valueFuture = <T>(value: T): Future<T> => [
  value,
  {
    error: null,
    loading: null,
  },
];

export const flatFutures = <T>(futures: Future<T>[]): Future<(T | null)[]> => {
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
  entities: Entities<Future<T>>,
): Future<Entities<T | null>> => {
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
