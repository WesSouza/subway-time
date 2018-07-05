import { Link } from '@reach/router';
import * as React from 'react';

import styles from './styles.css';

const NavigationBar = () => (
  <div className={styles.NavigationBar}>
    <div className={styles.searchBox}>
      <input
        className={styles.searchInput}
        type="search"
        name="search"
        aria-label="Subway station search"
      />
    </div>
    <div className={styles.menuItems}>
      <Link className={styles.menuItem} to="/">
        Home
      </Link>
      <Link className={styles.menuItem} to="/map">
        Map
      </Link>
    </div>
  </div>
);

export default NavigationBar;
