import { Link, RouteComponentProps } from '@reach/router';
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';

import ErrorMessage from '~/components/ErrorMessage';
import { TimeTable } from '~/components/TimeTable';
import { lineActions, lineState } from '~/state/line';
import { stationState, stationActions, Station } from '~/state/station';

interface Props extends RouteComponentProps {
  stationId?: string;
}

const Station = ({ stationId }: Props) => {
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

  const station = stationId && stationsById ? stationsById[stationId] : null;

  // # Actions

  const loadData = useCallback((station: Station) => {
    stationActions.fetchStationPlatformsByStationId(station.id);
    station.lineIds.forEach(lineId => {
      lineActions.fetchLineAdvisories(lineId);
    });
  }, []);

  if (!stationId) {
    return null;
  }

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
        loadData={loadData}
        platformsByStationId={platformsByStationId}
        station={station}
      />
    </>
  );
};

export default Station;
