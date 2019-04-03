import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { lineActions, lineState } from '~/state/line';
import { stationState, stationActions } from '~/state/station';

import ErrorMessage from '~/components/ErrorMessage';
import TimeTable from '~/components/TimeTable';
import { Link } from '@reach/router';

interface IProps {
  path?: string;
  stationId?: string;
}

const Station = ({ stationId }: IProps) => {
  if (!stationId) {
    return null;
  }

  // # Data dependencies

  const advisoriesByLineId = lineState.useObserver(
    ({ advisoriesByLineId }) => advisoriesByLineId,
  );

  const platformsByStationId = stationState.useObserver(
    ({ platformsByStationId }) => platformsByStationId,
  );

  const [stationsById] = stationState.useFutureObserver(
    ({ stationsById }) => stationsById,
  );

  // # Data

  const station = stationsById ? stationsById[stationId] : null;
  const lineIds = station ? station.lineIds : [];

  // # Effects

  useEffect(() => {
    fetchStationPlatforms();
  }, [stationId]);

  useEffect(() => {
    fetchAdvisories(lineIds);
  }, [lineIds]);

  const fetchAdvisories = (lineIds: string[]) => {
    lineIds.forEach(lineId => {
      lineActions.fetchLineAdvisories(lineId);
    });
  };

  // # Actions

  const fetchStationPlatforms = () => {
    stationActions.fetchStationPlatformsByStationId(stationId);
  };

  const reloadAll = useCallback(() => {
    fetchStationPlatforms();
    fetchAdvisories(lineIds);
  }, [lineIds]);

  // # Render

  if (!station) {
    return (
      <ErrorMessage>
        Station not found.
        <br />
        <br />
        <Link to="/">View nearby stations</Link>
      </ErrorMessage>
    );
  }

  return (
    <>
      <Helmet>
        <title>{station.name}</title>
      </Helmet>
      <TimeTable
        advisoriesByLineId={advisoriesByLineId}
        platformsByStationId={platformsByStationId}
        reloadData={reloadAll}
        station={station}
      />
    </>
  );
};

export default Station;
