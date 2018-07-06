import * as React from 'react';

interface IProps {
  path: string;
}

import styles from './styles.css';

const Home = ({ path }: IProps) => <div className={styles.Home} />;

export default Home;
