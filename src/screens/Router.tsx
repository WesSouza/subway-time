import { Router } from '@reach/router';
import * as React from 'react';

import Home from 'screens/Home';
import Map from 'screens/Map';
import NotFound from 'screens/NotFound';
import Search from 'screens/Search';
import Station from 'screens/Station';

const AppRouter = () => (
  <Router>
    <Home path="/" />
    <Map path="/map" />
    <Search path="/search" />
    <Station path="/station/:stationId" />
    <NotFound default={true} />
  </Router>
);

export default AppRouter;
