import * as React from 'react';

import shallowObjectEqual from 'lib/shallowObjectEqual';

interface IState {
  data: object;
  loaded: boolean;
}

interface IProps {
  children: (o: { [k: string]: any }) => React.ReactNode;
  parameters?: { [k: string]: string | undefined };
  property: string;
  query: (o?: { [k: string]: string | undefined }) => Promise<any>;
}

class Query extends React.Component<IProps, IState> {
  public state = {
    data: {},
    loaded: false,
  };

  public componentDidMount() {
    this.updateData();
  }

  public componentDidUpdate(prevProps: IProps) {
    const { query, parameters } = this.props;
    if (
      prevProps.query !== query ||
      !shallowObjectEqual(prevProps.parameters, parameters)
    ) {
      this.updateData();
    }
  }

  public render(): React.ReactNode {
    const { data, loaded } = this.state;
    const { property, children } = this.props;
    if (!loaded) {
      return children({ loading: true });
    }

    return children({ [property]: data });
  }

  private updateData = async () => {
    const { query, parameters } = this.props;
    const data = await query(parameters);
    this.setState({ data, loaded: true });
  };
}

export default Query;
