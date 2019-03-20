import React, { useEffect } from 'react';
import 'sanitize.css/sanitize.css';

import { flatFutures } from '~/lib/future';
import { lineActions, lineState } from '~/state/line';
import { stationActions, stationState } from '~/state/station';
import Router from '~/screens/Router';
import Search from '~/screens/Search';

import styles from './App.styles.css';

const App = () => {
  // # Data dependencies
  const linesFuture = lineState.useFutureObserver(({ linesById }) => linesById);

  const stationsFuture = stationState.useFutureObserver(
    ({ stationsById }) => stationsById,
  );

  const [, { error, loading }] = flatFutures<any>([
    linesFuture,
    stationsFuture,
  ]);

  // # Effects

  useEffect(() => {
    lineActions.fetchLines();
    stationActions.fetchStations();
  }, []);

  // # Render

  if (error) {
    return <div>Error {error.toString()}</div>;
  }

  if (loading) {
    return <div>Loading.</div>;
  }

  return (
    <div className={styles.App}>
      <Search />
      <Router />
    </div>
  );
};

export default App;
