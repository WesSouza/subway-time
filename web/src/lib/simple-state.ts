import { useEffect, useState } from 'react';

import { IFuture } from './future';

// # Interfaces

export interface State<T> {
  get(): T;
  observe<U>(
    selector: StateObserverSelector<T, U>,
    callback: StateObserverCallback<U>,
  ): () => void;
  set(state: StatePartial<T>): Promise<void>;
  set(updateFunction: (currentState: T) => StatePartial<T>): Promise<void>;
  useObserver<U>(
    selector: StateObserverSelector<T, U>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies?: ReadonlyArray<any>,
  ): U;
  useFutureObserver<U>(
    selector: StateObserverSelector<T, IFuture<U>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies?: ReadonlyArray<any>,
  ): IFuture<U | null>;
}

export interface StateObserver<T, U> {
  callback: StateObserverCallback<U>;
  lastSelectorResult?: U;
  selector: StateObserverSelector<T, U>;
}

export type StateObserverCallback<T> = (selectorResult: T) => void;

export type StateObserverSelector<T, U> = (state: T) => U;

export type StatePartial<T> = { [P in keyof T]?: T[P] };

// # State creator

export const createState = <T>(initialState: T): State<T> => {
  const data: T = initialState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const observers: (StateObserver<T, any> | null)[] = [];
  let isCallingObservers = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let observerTimers: any = null;

  const get = (): T => {
    return data;
  };

  const set = async (
    stateOrFunction: StatePartial<T> | ((currentState: T) => StatePartial<T>),
  ): Promise<void> => {
    if (isCallingObservers) {
      console.warn(
        'Calling set while observers are being called should be avoided.',
      );
    }

    let state: StatePartial<T>;

    if (typeof stateOrFunction === 'function') {
      state = stateOrFunction.call(null, data);
    } else {
      state = stateOrFunction;
    }

    Object.assign(data, state);

    return new Promise(resolve => {
      resolve();

      scheduleObservers();
    });
  };

  const observe = <U>(
    selector: StateObserverSelector<T, U>,
    callback: StateObserverCallback<U>,
  ): (() => void) => {
    const observer: StateObserver<T, U> = {
      selector,
      callback,
      lastSelectorResult: selector(data),
    };
    observers.push(observer);
    const observerIndex = observers.length - 1;
    return () => {
      if (!observers[observerIndex]) {
        console.warn(
          `No observer set on observerIndex`,
          observerIndex,
          initialState,
        );
      }
      observers[observerIndex] = null;
    };
  };

  const scheduleObservers = () => {
    if (observerTimers) {
      clearTimeout(observerTimers);
    }
    observerTimers = requestAnimationFrame(callObservers);
  };

  const callObservers = () => {
    isCallingObservers = true;
    observers.forEach(observer => {
      try {
        if (!observer) {
          return;
        }
        const { callback, lastSelectorResult, selector } = observer;
        const selectorResult = selector(data);
        if (selectorResult !== lastSelectorResult) {
          observer.lastSelectorResult = selectorResult;
          callback(selectorResult);
        }
      } catch (error) {
        console.error(error);
      }
    });
    isCallingObservers = false;
  };

  const useObserver = <U>(
    selector: StateObserverSelector<T, U>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies: ReadonlyArray<any> = [],
  ): U => {
    const currentState = get();
    const initialValue = selector.call(null, currentState);

    const [data, setData] = useState<U>(initialValue);

    // FIXME: Uhh, this is a bug, but fixing it causes a worse bug ¯\_(ツ)_/¯
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => observe(selector, (data: U) => setData(data)), [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...dependencies,
    ]);

    return data;
  };

  const useFutureObserver = <U>(
    selector: StateObserverSelector<T, IFuture<U>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies: ReadonlyArray<any> = [],
  ): IFuture<U> => {
    const currentState = get();
    const initialFuture = selector.call(null, currentState);

    const [future, setData] = useState<IFuture<U>>(initialFuture);

    // FIXME: Uhh, this is a bug, but fixing it causes a worse bug ¯\_(ツ)_/¯
    useEffect(
      () => observe(selector, (future: IFuture<U>) => setData(future)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...dependencies],
    );

    return future;
  };

  return { get, observe, set, useFutureObserver, useObserver };
};
