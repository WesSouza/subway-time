const compression = require('compression');
const express = require('express');
const { readFileSync } = require('fs');
const https = require('https');
const { resolve } = require('path');
const serveStatic = require('serve-static');

const { passthrough } = require('./mtaPassthrough');

const certificatesPath = resolve(__dirname, '../../certificates/');
const publicPath = resolve(__dirname, '../build');

const app = express();

const setHeaders = (res, path) => {
  if (path.match(/\.(gif|png|jpe?g)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=7200');
  } else if (path.match(/\.(css|js)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=3024000');
  }
};

const indexContents = readFileSync(resolve(publicPath, './index.html'), 'utf8');
const sendIndex = (req, res) => {
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

try {
  const key = readFileSync(resolve(certificatesPath, './privkey1.pem'), 'utf8');
  const cert = readFileSync(
    resolve(certificatesPath, './fullchain1.pem'),
    'utf8',
  );

  const httpsServer = https.createServer({ key, cert }, app);
  httpsServer.listen(process.env.PORT_HTTPS || 3443);

  // tslint:disable-next-line no-empty
} catch (e) {}
