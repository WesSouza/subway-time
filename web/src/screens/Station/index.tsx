import { Link, RouteComponentProps } from '@reach/router';
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';

import ErrorMessage from '~/components/ErrorMessage';
import { TimeTable } from '~/components/TimeTable';
import { fetchLineAdvisories } from '~/state/line/effects';
import { getAdvisoriesByLineId } from '~/state/line/selectors';
import { lineStore } from '~/state/line/store';
import { fetchStationPlatformsByStationId } from '~/state/station/effects';
import {
  getPlatformsByStationId,
  getStationsById,
} from '~/state/station/selectors';
import { stationStore } from '~/state/station/store';
import { Station } from '~/state/station/types';

interface Props extends RouteComponentProps {
  stationId?: string;
}

const Station = ({ stationId }: Props) => {
  // # Data dependencies

  const advisoriesByLineId = lineStore.useSelector(getAdvisoriesByLineId);
  const platformsByStationId = stationStore.useSelector(
    getPlatformsByStationId,
  );
  const [stationsById] = stationStore.useSelector(getStationsById);

  // # Data

  const station = stationId && stationsById ? stationsById[stationId] : null;

  // # Actions

  const loadData = useCallback((station: Station) => {
    fetchStationPlatformsByStationId(station.id);
    station.lineIds.forEach(lineId => {
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
