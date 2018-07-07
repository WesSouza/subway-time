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
  <Query
    query={getStationWithTimes}
    parameters={{ stationId }}
    renderWhenError={
      <div className={styles.centralized}>Unable to retrieve time table.</div>
    }
    renderWhenLoading={
      <div className={styles.centralized}>
        <div className={styles.loader} />
      </div>
    }
  >
    {({ data, lastUpdate, updateData }: IQueryResult<IStation>) => (
      <TimeTable
        lastUpdate={lastUpdate}
        station={data}
        updateData={updateData}
      />
    )}
  </Query>
);

export default Station;
