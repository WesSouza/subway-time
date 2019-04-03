import React, { useEffect, useState, useCallback } from 'react';
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
import { LinedBlock } from '~/components/LinedBlock';

const Home = (_props: IProps) => {
  // # Geolocation data
  const [
    coordinates,
    { error: coordinatesError, loading: coordinatesLoading },
  ] = useGeolocation({ updateMinimumDistance: 250 });

  // # Data dependencies
  const advisoriesByLineId = lineState.useObserver(
    ({ advisoriesByLineId }) => advisoriesByLineId,
  );

  const [stationsById] = stationState.useFutureObserver(
    ({ stationsById }) => stationsById,
  );

  const platformsByStationId = stationState.useObserver(
    ({ platformsByStationId }) => platformsByStationId,
  );

  // # Data
  const [sortedStations, setSortedStations] = useState<IStation[]>([]);
  const [sortedStationIds, setSortedStationIds] = useState<string[]>([]);
  const [lineIds, setLineIds] = useState<string[]>([]);

  // # Effects

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
    reloadData(sortedStationIds, lineIds);
  }, [sortedStationIds, lineIds]);

  // # Callbacks

  const reloadData = useCallback((stationIds: string[], lineIds: string[]) => {
    stationIds.forEach(stationId => {
      stationActions.fetchStationPlatformsByStationId(stationId);
    });
    lineIds.forEach(lineId => {
      lineActions.fetchLineAdvisories(lineId);
    });
  }, []);

  const reloadPage = useCallback(() => {
    location.reload();
  }, []);

  if (coordinatesLoading) {
    return (
      <LinedBlock>
        <ErrorMessage retryOnClick={reloadPage}>
          Finding nearby stations...
        </ErrorMessage>
      </LinedBlock>
    );
  }

  if (
    coordinatesError &&
    coordinatesError.message === GeolocationErrors.PERMISSION_DENIED
  ) {
    return (
      <LinedBlock>
        <ErrorMessage retryOnClick={reloadPage}>
          Unable to find nearby stations.
          <br />
          <br />
          Please allow location access.
        </ErrorMessage>
      </LinedBlock>
    );
  }

  if (coordinatesError || !coordinates) {
    return (
      <LinedBlock>
        <ErrorMessage retryOnClick={reloadPage}>
          Unable to find nearby stations.
          <br />
          <br />
          Please use the search bar above.
        </ErrorMessage>
      </LinedBlock>
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
            platformsByStationId={platformsByStationId}
            reloadData={reloadData}
            station={station}
          />
        ))}
        <LinedBlock>
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
        </LinedBlock>
      </div>
    </>
  );
};

export default Home;
