import './global.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

if (process.env.NODE_ENV === 'development') {
  const debugData = {
    state: {
      lineEffects: require('./state/line/effects'),
      lineStore: require('./state/line/store').lineStore,
      stationEffects: require('./state/station/effects'),
      stationStore: require('./state/station/store').stationStore,
    },
  };

  Object.assign(globalThis, debugData);
}

if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.href = location.href.replace(/^http:\/\//, 'https://');
} else {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
}
