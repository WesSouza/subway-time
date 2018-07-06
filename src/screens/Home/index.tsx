import * as React from 'react';

interface IProps {
  path: string;
}

import styles from './styles.css';

const Home = ({ path }: IProps) => (
  <div className={styles.Home}>
    Welcome.<br />
    <br />
    Begin by searching for a station above.
  </div>
);

export default Home;
