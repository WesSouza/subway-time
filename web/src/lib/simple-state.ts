import { useEffect, useState } from 'react';

import { IFuture } from './future';

// # Interfaces

export interface IState<T> {
  get(): T;
  observe<U>(
    selector: IStateObserverSelector<T, U>,
    callback: IStateObserverCallback<U>,
  ): () => void;
  set(state: IStatePartial<T>): Promise<void>;
  set(updateFunction: (currentState: T) => IStatePartial<T>): Promise<void>;
  useObserver<U>(
    selector: IStateObserverSelector<T, U>,
    dependencies?: ReadonlyArray<any>,
  ): U;
  useFutureObserver<U>(
    selector: IStateObserverSelector<T, IFuture<U>>,
    dependencies?: ReadonlyArray<any>,
  ): IFuture<U | null>;
}

export interface IStateObserver<T, U> {
  callback: IStateObserverCallback<U>;
  lastSelectorResult?: U;
  selector: IStateObserverSelector<T, U>;
}

export type IStateObserverCallback<T> = (selectorResult: T) => void;

export type IStateObserverSelector<T, U> = (state: T) => U;

export type IStatePartial<T> = { [P in keyof T]?: T[P] };

// # State creator

export const createState = <T>(initialState: T): IState<T> => {
  const data: T = initialState;
  const observers: (IStateObserver<T, any> | null)[] = [];
  let isCallingObservers = false;
  let observerTimers: any = null;

  const get = (): T => {
    return data;
  };

  const set = async (
    stateOrFunction: IStatePartial<T> | ((currentState: T) => IStatePartial<T>),
  ): Promise<void> => {
    if (isCallingObservers) {
      console.warn(
        'Calling set while observers are being called should be avoided.',
      );
    }

    let state: IStatePartial<T>;

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
    selector: IStateObserverSelector<T, U>,
    callback: IStateObserverCallback<U>,
  ): (() => void) => {
    const observer: IStateObserver<T, U> = {
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
    selector: IStateObserverSelector<T, U>,
    dependencies: ReadonlyArray<any> = [],
  ): U => {
    const currentState = get();
    const initialValue = selector.call(null, currentState);

    const [data, setData] = useState<U>(initialValue);

    useEffect(
      () => observe(selector, (data: U) => setData(data)),
      dependencies,
    );

    return data;
  };

  const useFutureObserver = <U>(
    selector: IStateObserverSelector<T, IFuture<U>>,
    dependencies: ReadonlyArray<any> = [],
  ): IFuture<U> => {
    const currentState = get();
    const initialFuture = selector.call(null, currentState);

    const [future, setData] = useState<IFuture<U>>(initialFuture);

    useEffect(
      () => observe(selector, (future: IFuture<U>) => setData(future)),
      dependencies,
    );

    return future;
  };

  return { get, observe, set, useFutureObserver, useObserver };
};
