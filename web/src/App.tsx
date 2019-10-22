import React, { useCallback, useEffect } from 'react';
import 'sanitize.css/sanitize.css';

import { flatFutures } from './lib/future';
import { lineStore } from './state/line/store';
import { fetchLines } from './state/line/effects';
import { getLinesById } from './state/line/selectors';
import { stationStore } from './state/station/store';
import { fetchStations } from './state/station/effects';
import { getStationsById } from './state/station/selectors';

import ErrorMessage from './components/ErrorMessage';
import { LinedBlock } from './components/LinedBlock';
import { Header } from './screens/Header';
import Router from './screens/Router';

import styles from './App.styles.css';

const App = () => {
  // # Data dependencies
  const linesFuture = lineStore.useSelector(getLinesById);

  const stationsFuture = stationStore.useSelector(getStationsById);

  const [, { error, loading }] = flatFutures<unknown>([
    linesFuture,
    stationsFuture,
  ]);

  // # Effects

  useEffect(() => {
    fetchLines();
    fetchStations();
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
