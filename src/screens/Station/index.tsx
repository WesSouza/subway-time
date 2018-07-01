import * as React from 'react';

interface IProps {
  path: string;
  stationId?: string;
}

const Station = ({ path, stationId }: IProps) => <div>Station {stationId}</div>;

export default Station;
