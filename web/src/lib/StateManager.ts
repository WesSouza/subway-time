import produce, { Draft } from 'immer';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export type SelectorFn<T, U> = (state: T) => U;

interface Selector<T, U> {
  callback: (newValue: U) => void;
  currentValue: U;
  selectorFn: SelectorFn<T, U>;
}

export class StateManager<T> {
  private internalData: Readonly<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private publishTimer: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribers = new Map<(newValue: any) => void, Selector<T, any>>();

  constructor(initialState: T) {
    this.internalData = initialState;
  }

  get state(): Readonly<T> {
    return this.internalData;
  }

  mutate(mutation: (draft: Draft<T>) => void) {
    this.internalData = produce(this.internalData, mutation);

    // Delay publishing to the next macro task
    clearTimeout(this.publishTimer);
    this.publishTimer = setTimeout(() => {
      this.publish();
    }, 0);
  }

  publish() {
    for (const [callback, selector] of this.subscribers) {
      const { currentValue, selectorFn } = selector;
      const newValue = selectorFn(this.internalData);
      if (newValue === currentValue) {
        continue;
      }

      this.subscribers.set(callback, {
        ...selector,
        currentValue: newValue,
      });

      // TODO: protect against infinite recursion by incrementing and
      // decrementing a counter around this call
      callback.call(null, newValue);
    }
  }

  subscribe<U>(selectorFn: SelectorFn<T, U>, callback: (newValue: U) => void) {
    this.subscribers.set(callback, {
      callback,
      currentValue: selectorFn.call(null, this.internalData),
      selectorFn,
    });

    return () => this.unsubscribe(callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unsubscribe(callback: (newValue: any) => void) {
    this.subscribers.delete(callback);
  }

  useSelector<U>(selectorFn: SelectorFn<T, U>) {
    const initialValue = selectorFn(this.internalData);
    const [state, setState] = useState<U>(initialValue);

    let closureStack: MutableRefObject<string | undefined> | null = null;
    let numberOfReSubs: MutableRefObject<number> | null = null;
    if (process.env.NODE_ENV === 'development') {
      closureStack = useRef(Error().stack);
      numberOfReSubs = useRef(0);
    }

    useEffect(() => {
      if (process.env.NODE_ENV === 'development' && numberOfReSubs) {
        if (numberOfReSubs.current === 1) {
          console.warn(
            'Warning: It looks like a selector function was passed to ' +
              '`useSelector` as an anonymous function.\n' +
              '\n' +
              'This will cause your selector to re-subscribe on each ' +
              'render, which will cause performance issues. Make sure to ' +
              'either use a hoisted selector, or a function imported from ' +
              'a selectors file.\n' +
              '\n' +
              'This error happened on:\n' +
              '\n' +
              (closureStack ? closureStack.current : ''),
          );
        }
        numberOfReSubs.current += 1;
      }

      return this.subscribe(selectorFn, (newValue: U) => {
        setState(newValue);
      });
    }, [closureStack, numberOfReSubs, selectorFn]);

    return state;
  }

  // eslint-disable-next-line @typescript-eslint/camelcase
  DEBUG_destroy() {
    clearTimeout(this.publishTimer);
    for (const callback of this.subscribers.keys()) {
      this.subscribers.delete(callback);
    }
  }
}
