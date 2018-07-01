import * as React from 'react';

import TimeTable from 'components/TimeTable';

interface IProps {
  path: string;
}

const data = {
  lines: [
    {
      color: '#000',
      directions: [
        {
          name: 'Uptown',
          trains: [
            {
              destinationStationName: 'Fulton St',
              minutes: 1,
            },
            {
              destinationStationName: 'Fulton St',
              minutes: 3,
            },
            {
              destinationStationName: 'Fulton St',
              minutes: 6,
            },
          ],
        },
        {
          name: 'Downtown',
          trains: [
            {
              destinationStationName: 'Fulton St',
              minutes: 3,
            },
            {
              destinationStationName: 'Fulton St',
              minutes: 10,
            },
          ],
        },
      ],
      id: 'F',
    },
  ],
  station: {
    id: 'F00',
    name: 'Bergen St',
  },
};

const Home = ({ path }: IProps) => <TimeTable {...data} />;

export default Home;
