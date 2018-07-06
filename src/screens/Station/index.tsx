import * as React from 'react';

import { getStationWithTimes } from 'data/stations';
import { IStation } from 'models/models';

import Query from 'components/Query';
import TimeTable from 'components/TimeTable';

interface IProps {
  path: string;
  stationId?: string;
}

const Station = ({ path, stationId }: IProps) => (
  <Query
    query={getStationWithTimes}
    parameters={{ stationId }}
    property="station"
  >
    {({ loading, station }: { loading?: boolean; station?: IStation }) =>
      !loading && station ? <TimeTable station={station} /> : null
    }
  </Query>
);

export default Station;
