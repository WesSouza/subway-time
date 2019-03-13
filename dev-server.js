var proxy = require('express-http-proxy');
var app = require('express')();

const proxyReqPathResolver = req => req.originalUrl;

app.use('/api/*', proxy('localhost:3080', { proxyReqPathResolver }));
app.use('/', proxy('localhost:1234'));

app.listen(3000);
