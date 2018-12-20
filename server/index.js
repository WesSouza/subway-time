const compression = require('compression');
const express = require('express');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const serveStatic = require('serve-static');

const { passthrough } = require('./mtaPassthrough');

const publicPath = resolve(__dirname, '../build');

const app = express();

const setHeaders = (res, path) => {
  if (path.match(/\.(gif|png|jpe?g)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=7200');
  } else if (path.match(/\.(css|js)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=3024000');
  }
};

let indexContents;
const sendIndex = (req, res) => {
  if (!indexContents) {
    indexContents = readFileSync(resolve(publicPath, './index.html'), 'utf8');
  }
  let LINEID = 'S';
  if (req.params && req.params.stationId) {
    LINEID = req.params.stationId.charAt(0);
  }
  const data = indexContents.replace(/\{\{LINEID\}\}/g, LINEID);
  res.send(data);
};

app.use(compression());

app.get('/', sendIndex);
app.get('/map', sendIndex);
app.get('/station/:stationId', sendIndex);

app.get(
  '/api/getAdvisoryDetail/:lineId',
  passthrough('getAdvisoryDetail', 60 * 1000),
);
app.get('/api/getTime/:lineId/:stationId', passthrough('getTime', 10 * 1000));

app.use(serveStatic(publicPath));

app.all('*', (req, res) => {
  res.status(404);
  sendIndex(req, res);
});

app.listen(process.env.PORT || 3080);
