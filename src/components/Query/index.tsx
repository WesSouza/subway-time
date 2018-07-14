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
  renderWhenError?: React.ReactNode;
  renderWhenLoading?: React.ReactNode;
  query: (o?: { [k: string]: string | undefined }) => Promise<any>;
}

export interface IQueryResult<T> {
  data: T;
  lastUpdate: number;
  updateData: () => void;
}

class Query extends React.PureComponent<IProps, IState> {
  public state = {
    data: null,
    error: '',
    lastUpdate: 0,
    loading: true,
  };
  private unmounted = false;
  private loadingDelay = 200;
  private loadingTimer: any = null;

  public componentDidMount() {
    this.unmounted = false;
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

  public componentWillUnmount() {
    this.unmounted = true;
  }

  public render(): React.ReactNode {
    const { data, error, lastUpdate, loading } = this.state;
    const { children, renderWhenError, renderWhenLoading } = this.props;
    const updateData = this.updateData;

    if (error) {
      return renderWhenError || null;
    }

    if (loading) {
      return renderWhenLoading || null;
    }

    return children({
      data,
      lastUpdate,
      updateData,
    });
  }

  private updateData = () => {
    const { query, parameters } = this.props;
    const lastUpdate = Date.now();
    this.loadingTimer = setTimeout(() => {
      this.setState({ data: null, error: '', lastUpdate: 0, loading: true });
    }, this.loadingDelay);
    query(parameters)
      .then(data => {
        if (this.unmounted) {
          return;
        }
        clearTimeout(this.loadingTimer);
        this.setState({ data, error: '', lastUpdate, loading: false });
      })
      .catch(error => {
        console.error(error);
        if (this.unmounted) {
          return;
        }
        clearTimeout(this.loadingTimer);
        this.setState({
          data: null,
          error: error.toString(),
          lastUpdate,
          loading: false,
        });
      });
  };
}

export default Query;
