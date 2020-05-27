import { Request, Response } from 'express-serve-static-core';
import got from 'got';

import config from './config';
import { MtaPathKeys } from './constants';

const { mta } = config;
const cache: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [parsedUrl: string]: any;
} = {};

const get = async (url: string, params: { [param: string]: string }) => {
  const parsedUrl = url.replace(/:([^\/]+)/g, (_, key) => params[key] || '');
  return got(parsedUrl, { responseType: 'json' });
};

export const passthrough = (pathKey: MtaPathKeys, cacheExpire: number) => (
  req: Request<{ [param: string]: string }>,
  res: Response,
): void => {
  const { params, path } = req;
  if (cacheExpire && cache[path] && cache[path].expire >= Date.now()) {
    res.send(cache[path].data);
    return;
  }

  get(`${mta.baseUrl}${mta[pathKey]}`, params)
    .then((response) => {
      const data = response.body;
      if (data && cacheExpire) {
        cache[path] = {
          data,
          expire: Date.now() + cacheExpire,
        };
      }
      res.json(data);
    })
    .catch((e) => {
      res.status(500);
      res.json({ error: e.toString() });
    });
};
