import * as React from 'react';
import { Helmet } from 'react-helmet';

import { ILineAdvisory } from '~/state/line';
import { IStation } from '~/state/station';

import LineAdvisories from '~/components/LineAdvisories';
import Query, { IQueryResult } from '~/components/Query';
import TimeTable from '~/components/TimeTable';

interface IProps {
  path: string;
}

import styles from './styles.css';

class Home extends React.Component<IProps> {
  public render() {
    return (
      <div className={styles.Home}>
        <Helmet>
          <title>Subway Ti.me</title>
          <link rel="shortcut icon" href="/icons/S.png" type="image/png" />
          <link rel="apple-touch-icon" href="/icons/S@8x.png" />
        </Helmet>
        <Query
          query={getNearbyStations(4)}
          renderWhenError={this.renderNoLocation}
          renderWhenLoading={
            <React.Fragment>
              <TimeTable.Skeleton />
              <TimeTable.Skeleton />
            </React.Fragment>
          }
        >
          {({ data }: IQueryResult<string[]>) =>
            data.map(stationId => this.renderTimeTable(stationId))
          }
        </Query>
        <div className={styles.credits}>
          <p className={styles.smaller}>
            Built with <span className={styles.love}>&lt;3</span> by{' '}
            <a href="https://wes.dev/" target="_blank">
              @WesSouza
            </a>
            .
          </p>
          <p className={styles.smaller}>
            <a href="https://github.com/WesSouza/subway-time" target="_blank">
              Fork it on GitHub.
            </a>
          </p>
        </div>
      </div>
    );
  }

  public renderTimeTable(stationId: string) {
    return (
      <Query
        key={stationId}
        query={getStationWithTimes}
        parameters={{ stationId }}
        renderWhenError={
          <div className={styles.centralized}>
            Unable to retrieve time table.
          </div>
        }
        renderWhenLoading={<TimeTable.Skeleton />}
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
  }

  public renderNoLocation = () => {
    return (
      <div className={styles.error}>
        <div className={styles.errorMessage}>
          Unable to find nearby stations.
          <br />
          <br />
          Please allow location access.
        </div>
        <button
          className={styles.errorRetry}
          onClick={this.handleRetryClick}
          type="button"
        >
          Try again
        </button>
      </div>
    );
  };

  public handleRetryClick = () => {
    location.reload();
  };
}

export default Home;
