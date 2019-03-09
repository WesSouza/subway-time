import * as React from 'react';
import 'sanitize.css/sanitize.css';

import Router from '~/screens/Router';
import Search from '~/screens/Search';

import styles from './App.styles.css';

const App = () => (
  <div className={styles.App}>
    <Search />
    <Router />
  </div>
);

export default App;
