const got = require('got');

const { mta } = require('../config.js');

const cache = {};

const get = async (url, params) => {
  const parsedUrl = url.replace(/:([^\/]+)/g, (_, key) => params[key] || '');
  return got(parsedUrl, { json: true });
};

const passthrough = (pathKey, cacheExpire) => (req, res) => {
  if (cacheExpire && cache[pathKey] && cache[pathKey].expire >= Date.now()) {
    res.send(cache[pathKey].data);
    return;
  }

  const { params } = req;
  get(`${mta.baseUrl}${mta[pathKey]}`, params)
    .then(response => {
      const data = response.body;
      if (cacheExpire) {
        cache[pathKey] = {
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
