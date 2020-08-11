import { Router } from '@reach/router';
import * as React from 'react';

import Home from '~/src/screens/Home';
import NotFound from '~/src/screens/NotFound';
import Station from '~/src/screens/Station';

const AppRouter = () => (
  <Router>
    <Home path="/" />
    <Station path="/station/:stationId" />
    <NotFound default={true} />
  </Router>
);

export default AppRouter;
