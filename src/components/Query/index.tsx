import * as React from 'react';

import shallowObjectEqual from 'lib/shallowObjectEqual';

interface IState {
  data: object;
  error: string;
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
    error: '',
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
    const { data, error, loaded } = this.state;
    const { property, children } = this.props;
    const reloadData = this.updateData;

    if (error) {
      return children({ error, reloadData });
    }

    if (!loaded) {
      return children({ loading: true, reloadData });
    }

    return children({ [property]: data, reloadData });
  }

  private updateData = () => {
    const { query, parameters } = this.props;
    query(parameters)
      .then(data => {
        this.setState({ data, loaded: true });
      })
      .catch(error => {
        console.error(error);
        this.setState({ data: {}, loaded: true, error: error.toString() });
      });
  };
}

export default Query;
