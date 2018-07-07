// tslint:disable-next-line no-var-requires
const config = require('../config');

import {
  IRawMtaTimes,
  IRawSubwayLine,
  IRawSubwayStation,
  IRawTimesByLineId,
} from 'api/api.interfaces';

import {
  IStationLineDirection,
  IStationLineDirectionTime,
} from 'models/models';

const cache: { [k: string]: any } = {};

export const get = async (
  url: string,
  params: { [k: string]: string } = {},
): Promise<any> => {
  const parsedUrl = url.replace(
    /:([^\/]+)/g,
    (_, key: string) => params[key] || '',
  );
  const result = await fetch(parsedUrl);
  return await result.json();
};

export const getRawSubwayLines = async (): Promise<IRawSubwayLine[]> => {
  const { baseUrl, subwayLines } = config.subwaytime;
  if (!cache.getRawSubwayLines) {
    cache.getRawSubwayLines = await get(`${baseUrl}${subwayLines}`);
  }
  return cache.getRawSubwayLines;
};

export const getRawSubwayStations = async (): Promise<IRawSubwayStation[]> => {
  const { baseUrl, subwayStations } = config.subwaytime;
  if (!cache.getRawSubwayStations) {
    cache.getRawSubwayStations = await get(`${baseUrl}${subwayStations}`);
  }
  return cache.getRawSubwayStations;
};

export const getRawTimesByLineId = async (
  stationId: string,
): Promise<IRawTimesByLineId> => {
  const { baseUrl, getTime } = config.mta;
  const lineId = stationId.substr(0, 1);
  const mtaTimes: IRawMtaTimes = await get(`${baseUrl}${getTime}`, {
    lineId,
    stationId,
  });

  const timesByLineAndDirection = {};

  if (mtaTimes.message.messageType === 'ERROR') {
    throw new Error(mtaTimes.message.message);
  }

  Object.keys(mtaTimes)
    .filter(key => key.startsWith('direction'))
    .forEach(key => {
      const mtaDirection = mtaTimes[key];
      const { name: directionName, times } = mtaDirection;

      times.forEach(
        ({
          lastStation: lastStationName,
          minutes,
          route: timeLineId,
        }: {
          lastStation: string;
          minutes: number;
          route: string;
        }) => {
          if (!timesByLineAndDirection[timeLineId]) {
            timesByLineAndDirection[timeLineId] = {};
          }

          if (!timesByLineAndDirection[timeLineId][directionName]) {
            timesByLineAndDirection[timeLineId][directionName] = [];
          }

          timesByLineAndDirection[timeLineId][directionName].push({
            lastStationName,
            minutes,
          });
        },
      );
    });

  const result = {};
  Object.keys(timesByLineAndDirection).forEach(timeLineId => {
    if (!result[timeLineId]) {
      result[timeLineId] = [];
    }

    const directions = timesByLineAndDirection[timeLineId];
    Object.keys(directions).forEach(directionName => {
      const times: IStationLineDirectionTime[] = directions[directionName];
      const direction: IStationLineDirection = {
        name: directionName,
        times,
      };
      result[timeLineId].push(direction);
    });
  });

  return result;
};
