const { access, F_OK, ...fs } = require('fs');
const { promisify } = require('util');
const express = require('express');
const proxy = require('express-http-proxy');
const https = require('https');
const { resolve } = require('path');
const execFile = promisify(require('child_process').execFile);
const readFile = promisify(fs.readFile);

const exists = file =>
  new Promise(resolve => {
    access(file, F_OK, error => {
      if (error) resolve(false);
      resolve(true);
    });
  });

(async () => {
  // Certificate generation

  const CERT_PATH = resolve('./certs/localhost.pem');
  const KEY_PATH = resolve('./certs/localhost-key.pem');

  const hasCert = await exists(CERT_PATH);
  const hasKey = await exists(KEY_PATH);

  if (!hasCert || !hasKey) {
    await execFile('mkcert', [
      '-cert-file',
      CERT_PATH,
      '-key-file',
      KEY_PATH,
      'localhost',
      '127.0.0.1',
      '::1',
    ]);
  }

  if (!hasCert || !hasKey) {
    throw new Error(
      'Unable to create certificates using mkcert.\n\nhttps://github.com/FiloSottile/mkcert',
    );
  }

  // Express App

  const app = express();

  const proxyReqPathResolver = req => req.originalUrl;

  app.use('/api/*', proxy('localhost:3080', { proxyReqPathResolver }));
  app.use('/', proxy('localhost:1234'));

  // HTTPS server

  const cert = readFile(CERT_PATH);
  const key = await readFile(KEY_PATH);

  const server = https.createServer(
    {
      cert,
      key,
    },
    app,
  );

  const PORT = 3000;
  console.log(`Listening on https://localhost:${PORT}`);
  server.listen(PORT);
})();
