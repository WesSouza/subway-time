import React, { useCallback, useEffect } from 'react';
import 'sanitize.css/sanitize.css';

import ErrorMessage from './components/ErrorMessage';
import { LinedBlock } from './components/LinedBlock';
import { flatFutures } from './lib/future';
import { lineActions, lineState } from './state/line';
import { stationActions, stationState } from './state/station';
import { Header } from './screens/Header';
import Router from './screens/Router';

import styles from './App.styles.css';

const App = () => {
  // # Data dependencies
  const linesFuture = lineState.useFutureObserver(({ linesById }) => linesById);

  const stationsFuture = stationState.useFutureObserver(
    ({ stationsById }) => stationsById,
  );

  const [, { error, loading }] = flatFutures<unknown>([
    linesFuture,
    stationsFuture,
  ]);

  // # Effects

  useEffect(() => {
    lineActions.fetchLines();
    stationActions.fetchStations();
  }, []);

  // # Actions

  const reloadPage = useCallback(() => {
    location.reload();
  }, []);

  // # Render

  return (
    <div className={styles.App}>
      <Header />
      {error ? (
        <LinedBlock>
          <ErrorMessage retryOnClick={reloadPage}>
            There was a problem loading the app.
          </ErrorMessage>
        </LinedBlock>
      ) : !loading ? (
        <Router />
      ) : null}
    </div>
  );
};

export default App;
