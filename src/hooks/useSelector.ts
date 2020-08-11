import {
  DependencyList,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { SelectorFn, StateManager } from '~/lib/StateManager';

export function useSelector<T, U>(
  stateManager: StateManager<T>,
  selectorFn: SelectorFn<T, U>,
  deps: DependencyList = [],
) {
  const initialValue = selectorFn(stateManager.state);
  const value = useRef<U>(initialValue);
  const [, setState] = useState(0);

  const selectorFnCallback = useCallback(selectorFn, [selectorFn, ...deps]);
  useLayoutEffect(() => {
    return stateManager.subscribe(selectorFnCallback, (newValue) => {
      value.current = newValue;
      setState((number) => number + 1);
    });
  }, [selectorFnCallback, stateManager]);

  return value.current;
}
