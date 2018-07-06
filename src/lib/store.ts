interface IObserver {
  fn: (selectedState: any) => void;
  lastValue?: any;
  selector: (state: any) => any;
}

class Store<T> {
  private observers: Array<IObserver | undefined> = [];

  constructor(private state: T) {}

  public observe(
    selector: (state: T) => any,
    fn: (selectedState: any) => void,
  ) {
    this.observers.push({
      fn,
      selector,
    });
  }

  public unobserve(fn: (selectedState: any) => void) {
    const observerIndex = this.observers.findIndex(
      observer => (observer ? observer.fn === fn : false),
    );
    if (observerIndex !== -1) {
      this.observers[observerIndex] = undefined;
    }
  }

  public get() {
    return this.state;
  }

  public set(properties: T) {
    Object.assign(this.state, properties);
    this.publish();
  }

  private publish() {
    this.observers.forEach(observer => {
      if (!observer) {
        return;
      }
      const { fn, lastValue, selector } = observer;
      const value = selector.call(null, this.state);
      if (value !== lastValue) {
        observer.lastValue = value;
        fn.call(null, value);
      }
    });
  }
}

export default Store;
