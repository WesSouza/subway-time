const got = require('got');

const { mta } = require('../config.js');

const cache = {};

const get = async (url, params) => {
  const parsedUrl = url.replace(/:([^\/]+)/g, (_, key) => params[key] || '');
  return got(parsedUrl, { json: true });
};

const passthrough = (pathKey, cacheExpire) => (req, res) => {
  const { path } = req;
  if (cacheExpire && cache[path] && cache[path].expire >= Date.now()) {
    res.send(cache[path].data);
    return;
  }

  const { params } = req;
  get(`${mta.baseUrl}${mta[pathKey]}`, params)
    .then(response => {
      const data = response.body;
      if (cacheExpire) {
        cache[path] = {
          data,
          expire: Date.now() + cacheExpire,
        };
      }
      res.json(data);
    })
    .catch(e => {
      res.status(500);
      res.json({ error: e.toString() });
    });
};

module.exports = { passthrough };
