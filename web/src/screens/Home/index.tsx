import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { sortStationsByProximity } from '~/lib/sortStationsByProximity';
import { useGeolocation, GeolocationErrors } from '~/lib/useGeolocation';
import { lineState, lineActions } from '~/state/line';
import { IStation, stationState, stationActions } from '~/state/station';

import TimeTable from '~/components/TimeTable';

interface IProps {
  path: string;
}

import styles from './styles.css';
import ErrorMessage from '~/components/ErrorMessage';

const Home = (_props: IProps) => {
  // # Geolocation data
  const [
    coordinates,
    { error: coordinatesError, loading: coordinatesLoading },
  ] = useGeolocation({ updateMinimumDistance: 25 });

  // # Data dependencies
  const advisoriesByLineId = lineState.useObserver(
    ({ advisoriesByLineId }) => advisoriesByLineId,
  );

  const linesFuture = lineState.useFutureObserver(({ linesById }) => linesById);

  const stationsFuture = stationState.useFutureObserver(
    ({ stationsById }) => stationsById,
  );

  const platformsByStationId = stationState.useObserver(
    ({ platformsByStationId }) => platformsByStationId,
  );

  // # Data
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

  const reloadData = () => {
    fetchStationPlatforms(sortedStationIds);
    fetchAdvisories(lineIds);
  };

  const reloadPage = () => {
    location.reload();
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

  if (coordinatesLoading) {
    return (
      <ErrorMessage retryOnClick={reloadPage}>
        Finding nearby stations...
      </ErrorMessage>
    );
  }

  if (
    coordinatesError &&
    coordinatesError.message === GeolocationErrors.PERMISSION_DENIED
  ) {
    return (
      <ErrorMessage retryOnClick={reloadPage}>
        Unable to find nearby stations.
        <br />
        <br />
        Please allow location access.
      </ErrorMessage>
    );
  }

  if (coordinatesError || !coordinates) {
    return (
      <ErrorMessage retryOnClick={reloadPage}>
        Unable to find nearby stations.
        <br />
        <br />
        Please use the search bar above.
      </ErrorMessage>
    );
  }

  return (
    <>
      <Helmet>
        <title>SubwayTi.me</title>
      </Helmet>
      <div className={styles.Home}>
        {sortedStations.map(station => (
          <TimeTable
            advisoriesByLineId={advisoriesByLineId}
            key={station.id}
            linesFuture={linesFuture}
            platformsByStationId={platformsByStationId}
            reloadData={reloadData}
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
