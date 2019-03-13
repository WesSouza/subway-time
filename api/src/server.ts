import compression from 'compression';
import express from 'express';

import { MtaPathKeys } from './constants';
import { passthrough } from './mtaPassthrough';

const app = express();

app.use(compression());

app.get(
  '/api/getAdvisoryDetail/:lineId',
  passthrough(MtaPathKeys.getAdvisoryDetail, 60 * 1000),
);
app.get(
  '/api/getTime/:lineId/:stationId',
  passthrough(MtaPathKeys.getTime, 10 * 1000),
);

export default app;
