import { Router } from '@reach/router';
import * as React from 'react';

import Home from 'screens/Home';
import Map from 'screens/Map';
import NotFound from 'screens/NotFound';
import Station from 'screens/Station';

const AppRouter = () => (
  <Router>
    <Home path="/" />
    <Home path="/search" />
    <Map path="/map" />
    <Station path="/station/:stationId" />
    <NotFound default={true} />
  </Router>
);

export default AppRouter;
