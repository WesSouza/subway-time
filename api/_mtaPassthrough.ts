import { NowRequest, NowResponse } from '@vercel/node';
import got from 'got';

import config from '../src/config';
import { MtaPathKeys } from './_constants';

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
  req: NowRequest,
  res: NowResponse,
): void => {
  const { query, url } = req;
  if (!url) {
    return;
  }

  const urlString = url.toString();

  if (
    cacheExpire &&
    cache[urlString] &&
    cache[urlString].expire >= Date.now()
  ) {
    res.send(cache[urlString].data);
    return;
  }

  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      params[key] = value;
    }
  }

  get(`${mta.baseUrl}${mta[pathKey]}`, params)
    .then((response) => {
      const data = response.body;
      if (data && cacheExpire) {
        cache[urlString] = {
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
