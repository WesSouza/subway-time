import * as React from 'react';

import TimeTable from 'components/TimeTable';

interface IProps {
  path: string;
}

const Home = ({ path }: IProps) => <TimeTable />;

export default Home;
