import { Link, RouteComponentProps } from '@reach/router';
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';

import ErrorMessage from '~/src/components/ErrorMessage';
import { TimeTable } from '~/src/components/TimeTable';
import { useSelector } from '~/src/hooks/useSelector';
import { fetchLineAdvisories } from '~/src/state/line/effects';
import { getAdvisoriesByLineId } from '~/src/state/line/selectors';
import { lineStore } from '~/src/state/line/store';
import { fetchStationPlatformsByStationId } from '~/src/state/station/effects';
import {
  getPlatformsByStationId,
  getStationsById,
} from '~/src/state/station/selectors';
import { stationStore } from '~/src/state/station/store';
import { Station } from '~/src/state/station/types';

interface Props extends RouteComponentProps {
  stationId?: string;
}

const Station = ({ stationId }: Props) => {
  // # Data dependencies

  const advisoriesByLineId = useSelector(lineStore, getAdvisoriesByLineId);
  const platformsByStationId = useSelector(
    stationStore,
    getPlatformsByStationId,
  );
  const [stationsById] = useSelector(stationStore, getStationsById);

  // # Data

  const station = stationId && stationsById ? stationsById[stationId] : null;

  // # Actions

  const loadData = useCallback((station: Station) => {
    fetchStationPlatformsByStationId(station.id);
    station.lineIds.forEach((lineId) => {
      fetchLineAdvisories(lineId);
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
