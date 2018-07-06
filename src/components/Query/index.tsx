import * as React from 'react';

import shallowObjectEqual from 'lib/shallowObjectEqual';

interface IState {
  data: any;
  error: string;
  lastUpdate: number;
  loading: boolean;
}

interface IProps {
  children: (o: { [k: string]: any }) => React.ReactNode;
  parameters?: { [k: string]: string | undefined };
  query: (o?: { [k: string]: string | undefined }) => Promise<any>;
}

export interface IQueryResult<T> {
  data: T;
  error: string;
  lastUpdate: number;
  loading: boolean;
  updateData: () => void;
}

class Query extends React.Component<IProps, IState> {
  public state = {
    data: null,
    error: '',
    lastUpdate: 0,
    loading: true,
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
    const { data, error, lastUpdate, loading } = this.state;
    const { children } = this.props;
    const updateData = this.updateData;

    if (error) {
      return children({
        data: null,
        error,
        lastUpdate,
        loading: false,
        updateData,
      });
    }

    if (loading) {
      return children({
        data: null,
        error: '',
        lastUpdate,
        loading,
        updateData,
      });
    }

    return children({
      data,
      error: '',
      lastUpdate,
      loading: false,
      updateData,
    });
  }

  private updateData = () => {
    const { query, parameters } = this.props;
    const lastUpdate = Date.now();
    query(parameters)
      .then(data => {
        this.setState({ data, lastUpdate, loading: false });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          data: null,
          lastUpdate,
          loading: false,
          error: error.toString(),
        });
      });
  };
}

export default Query;
