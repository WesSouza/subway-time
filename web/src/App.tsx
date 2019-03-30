import React, { useEffect } from 'react';
import 'sanitize.css/sanitize.css';

import { flatFutures } from '~/lib/future';
import { lineActions, lineState } from '~/state/line';
import { stationActions, stationState } from '~/state/station';
import Router from '~/screens/Router';
import Search from '~/screens/Search';

import styles from './App.styles.css';
import LineId from './components/LineId';
import ErrorMessage from './components/ErrorMessage';

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

  // # Actions

  const reloadPage = () => {
    location.reload();
  };

  // # Render

  if (error) {
    console.error(error);
    return (
      <ErrorMessage retryOnClick={reloadPage}>
        There was a problem loading the app.
      </ErrorMessage>
    );
  }

  if (loading) {
    return (
      <div className={`${styles.App} ${styles.loading}`}>
        <LineId id={'S'} className={styles.splashLineId} color={null} />
      </div>
    );
  }

  return (
    <div className={styles.App}>
      <Search />
      <Router />
    </div>
  );
};

export default App;
