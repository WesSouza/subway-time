import * as React from 'react';

interface IProps {
  path: string;
}

import styles from './styles.css';

const Home = ({ path }: IProps) => (
  <div className={styles.Home}>
    <p>Welcome.</p>
    <p>Begin by searching for a station above.</p>
    <p className={`${styles.footnote} ${styles.smaller}`}>
      Built with <span className={styles.love}>&lt;3</span> by{' '}
      <a href="https://wesley.so/" target="_blank">
        @WesleydeSouza
      </a>.
    </p>
    <p className={styles.smaller}>
      <a href="https://github.com/WesleydeSouza/subway-time" target="_blank">
        Fork it on GitHub.
      </a>
    </p>
  </div>
);

export default Home;
