import * as React from 'react';
import { Helmet } from 'react-helmet';

import { ILineAdvisory } from '~/state/line';
import { IStation } from '~/state/station';
import { getAdvisoriesForLines, getStationWithTimes } from '~/state/stations';

import LineAdvisories from '~/components/LineAdvisories';
import Query, { IQueryResult } from '~/components/Query';
import TimeTable from '~/components/TimeTable';

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
    renderWhenLoading={<TimeTable.Skeleton />}
  >
    {({ data, lastUpdate, updateData }: IQueryResult<IStation>) => (
      <React.Fragment>
        <Helmet>
          <title>{data.name}</title>
          <link
            rel="shortcut icon"
            href={`/icons/${data.lines[0] ? data.lines[0].id : 'S'}.png`}
            type="image/png"
          />
          <link
            rel="apple-touch-icon"
            href={`/icons/${data.lines[0] ? data.lines[0].id : 'S'}@8x.png`}
          />
        </Helmet>
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
      </React.Fragment>
    )}
  </Query>
);

export default Station;
