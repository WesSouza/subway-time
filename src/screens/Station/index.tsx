import * as React from 'react';

import { getAdvisoriesForLines, getStationWithTimes } from 'data/stations';
import { ILineAdvisory, IStation } from 'models/models';

import LineAdvisories from 'components/LineAdvisories';
import Query, { IQueryResult } from 'components/Query';
import TimeTable from 'components/TimeTable';

import styles from './styles.css';

interface IProps {
  path?: string;
  stationId?: string;
}

const Station = ({ stationId }: IProps) => (
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
        advisoriesComponent={
          <Query
            query={getAdvisoriesForLines}
            parameters={{ lineIds: data.lineIds }}
          >
            {({ data: advisoryData }: IQueryResult<ILineAdvisory[]>) => (
              <LineAdvisories advisories={advisoryData} />
            )}
          </Query>
        }
        updateData={updateData}
      />
    )}
  </Query>
);

export default Station;
