import * as React from 'react';

import Store from '~/lib/store';

interface IState {
  data: any;
}

interface IProps {
  children: (o: { [k: string]: any }) => React.ReactNode;
  store: Store<any>;
  property: string;
}

class StoreValue extends React.Component<IProps, IState> {
  public state = {
    data: undefined,
  };

  public componentDidMount() {
    const { property, store } = this.props;
    store.observe((iStore: any) => iStore[property], this.updateData);
  }

  public componentDidUpdate(prevProps: IProps) {
    const { property, store } = this.props;
    if (prevProps.property !== property || prevProps.store !== store) {
      store.observe((iStore: any) => iStore[property], this.updateData);
      store.unobserve(this.updateData);
    }
  }

  public componentWillUnmount() {
    const { store } = this.props;
    store.unobserve(this.updateData);
  }

  public render(): React.ReactNode {
    const { data } = this.state;
    const { property, children } = this.props;
    return children({ [property]: data });
  }

  private updateData = (data: any) => {
    this.setState({ data });
  };
}

export default StoreValue;
