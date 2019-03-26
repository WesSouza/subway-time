import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { flatFutures, flatFutureEntities } from '~/lib/future';
import { sortStationsByProximity } from '~/lib/sortStationsByProximity';
import { useGeolocation } from '~/lib/useGeolocation';
import { lineState, lineActions } from '~/state/line';
import { IStation, stationState, stationActions } from '~/state/station';

import TimeTable from '~/components/TimeTable';

interface IProps {
  path: string;
}

import styles from './styles.css';

const Home = (_props: IProps) => {
  // # Geolocation data
  const [coordinates] = useGeolocation({ updateMinimumDistance: 25 });

  // # Data dependencies
  const advisoriesFuture = lineState.useFutureObserver(
    ({ advisoriesByLineId }) => flatFutureEntities(advisoriesByLineId),
  );

  const linesFuture = lineState.useFutureObserver(({ linesById }) => linesById);

  const stationsFuture = stationState.useFutureObserver(
    ({ stationsById }) => stationsById,
  );

  const platformsFuture = stationState.useFutureObserver(
    ({ platformsByStationId }) => flatFutureEntities(platformsByStationId),
  );

  // # Data
  const [, { error, loading }] = flatFutures<any>([
    linesFuture,
    stationsFuture,
  ]);

  const [stationsById] = stationsFuture;

  const [sortedStations, setSortedStations] = useState<IStation[]>([]);
  const [sortedStationIds, setSortedStationIds] = useState<string[]>([]);
  const [lineIds, setLineIds] = useState<string[]>([]);

  const fetchAdvisories = (lineIds: string[]) => {
    lineIds.forEach(lineId => {
      lineActions.fetchLineAdvisories(lineId);
    });
  };

  const fetchStationPlatforms = (stationIds: string[]) => {
    stationIds.forEach(stationId => {
      stationActions.fetchStationPlatformsByStationId(stationId);
    });
  };

  const reloadAll = () => {
    fetchStationPlatforms(sortedStationIds);
    fetchAdvisories(lineIds);
  };

  useEffect(() => {
    if (!stationsById || !coordinates) {
      return;
    }

    const stations = Object.values(stationsById);

    const localSortedStations = sortStationsByProximity(
      stations,
      coordinates.latitude,
      coordinates.longitude,
    ).slice(0, 5);
    setSortedStations(localSortedStations);
    setSortedStationIds(localSortedStations.map(station => station.id));

    setLineIds([
      ...new Set(localSortedStations.map(station => station.lineIds).flat()),
    ]);
  }, [stationsById, coordinates]);

  useEffect(() => {
    fetchStationPlatforms(sortedStationIds);
    fetchAdvisories(lineIds);
  }, [sortedStationIds.join(), lineIds.join()]);

  if (loading) {
    return <div>Loading.</div>;
  }

  if (error) {
    return <div>Error.</div>;
  }

  if (!coordinates) {
    return <div>Where are you?</div>;
  }

  return (
    <>
      <Helmet>
        <title>SubwayTi.me</title>
      </Helmet>
      <div className={styles.Home}>
        {sortedStations.map(station => (
          <TimeTable
            advisoriesFuture={advisoriesFuture}
            key={station.id}
            linesFuture={linesFuture}
            platformsFuture={platformsFuture}
            reloadData={reloadAll}
            station={station}
          />
        ))}
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
              Source code available on GitHub.
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
