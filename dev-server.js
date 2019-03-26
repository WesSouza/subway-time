const { execFileSync } = require('child_process');
const express = require('express');
const proxy = require('express-http-proxy');
const { existsSync, readFileSync } = require('fs');
const https = require('https');
const { resolve } = require('path');

// Certificate generation

const CERT_PATH = resolve('./certs/localhost.pem');
const KEY_PATH = resolve('./certs/localhost-key.pem');

if (!existsSync(CERT_PATH) || !existsSync(KEY_PATH)) {
  execFileSync('mkcert', [
    '-cert-file',
    CERT_PATH,
    '-key-file',
    KEY_PATH,
    'localhost',
    '127.0.0.1',
    '::1',
  ]);
}

if (!existsSync(CERT_PATH) || !existsSync(KEY_PATH)) {
  throw 'Unable to create certificates using mkcert.\n\nhttps://github.com/FiloSottile/mkcert';
}

// Express App

const app = express();

const proxyReqPathResolver = req => req.originalUrl;

app.use('/api/*', proxy('localhost:3080', { proxyReqPathResolver }));
app.use('/', proxy('localhost:1234'));

// HTTPS server

const server = https.createServer(
  {
    key: readFileSync(KEY_PATH),
    cert: readFileSync(CERT_PATH),
  },
  app,
);

const PORT = 3000;
console.log(`Listening on https://localhost:${PORT}`);
server.listen(PORT);
