import 'sanitize.css/sanitize.css';

import React, { useCallback, useEffect } from 'react';

import styles from './App.styles.css';
import ErrorMessage from './components/ErrorMessage';
import { LinedBlock } from './components/LinedBlock';
import { useSelector } from './hooks/useSelector';
import { flatFutures } from './lib/future';
import { Header } from './screens/Header';
import Router from './screens/Router';
import { fetchLines } from './state/line/effects';
import { getLinesById } from './state/line/selectors';
import { lineStore } from './state/line/store';
import { fetchStations } from './state/station/effects';
import { getStationsById } from './state/station/selectors';
import { stationStore } from './state/station/store';

const App = () => {
  // # Data dependencies
  const linesFuture = useSelector(lineStore, getLinesById);

  const stationsFuture = useSelector(stationStore, getStationsById);

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
