import * as React from 'react';

import { getStationWithTimes } from 'data/stations';
import { IStation } from 'models/models';

import Query from 'components/Query';
import TimeTable from 'components/TimeTable';

import styles from './styles.css';

interface IProps {
  path: string;
  stationId?: string;
}

const Station = ({ path, stationId }: IProps) => (
  <Query
    query={getStationWithTimes}
    parameters={{ stationId }}
    property="station"
  >
    {({
      error,
      loading,
      reloadData,
      station,
    }: {
      error: string;
      loading: boolean;
      reloadData: () => void;
      station?: IStation;
    }) =>
      error ? (
        <div className={styles.centralized}>Unable to retrieve time table.</div>
      ) : loading ? (
        <div className={styles.centralized}>
          <div className={styles.loader} />
        </div>
      ) : station ? (
        <TimeTable station={station} reloadData={reloadData} />
      ) : null
    }
  </Query>
);

export default Station;
