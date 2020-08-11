import subwayLinesPath from '~/data/subway-lines.json';
import subwayStationsPath from '~/data/subway-stations.json';

import { delay } from './delay';

export const Endpoints = {
  Lines: subwayLinesPath,
  LineAdvisories: '/api/getAdvisoryDetail/:lineId',
  Stations: subwayStationsPath,
  StationTrainTimes: '/api/getTime/:lineId/:stationId',
};

export const get = async <T>(
  url: string,
  params: { [k: string]: string } = {},
): Promise<T> => {
  const parsedUrl = url.replace(
    /:([^\/]+)/g,
    (_, key: string) => params[key] || '',
  );
  if (process.env.NODE_ENV === 'development') {
    await delay(Math.random() * 100 + 1000);
  }
  const result = await fetch(parsedUrl);
  return await result.json();
};
