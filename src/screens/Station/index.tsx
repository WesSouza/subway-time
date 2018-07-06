import * as React from 'react';

import { getStationWithTimes } from 'data/stations';
import { IStation } from 'models/models';

import Query, { IQueryResult } from 'components/Query';
import TimeTable from 'components/TimeTable';

import styles from './styles.css';

interface IProps {
  path: string;
  stationId?: string;
}

const Station = ({ path, stationId }: IProps) => (
  <Query query={getStationWithTimes} parameters={{ stationId }}>
    {({
      data,
      error,
      lastUpdate,
      loading,
      updateData,
    }: IQueryResult<IStation>) =>
      error ? (
        <div className={styles.centralized}>Unable to retrieve time table.</div>
      ) : loading ? (
        <div className={styles.centralized}>
          <div className={styles.loader} />
        </div>
      ) : data ? (
        <TimeTable
          lastUpdate={lastUpdate}
          station={data}
          updateData={updateData}
        />
      ) : null
    }
  </Query>
);

export default Station;
