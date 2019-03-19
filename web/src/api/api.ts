import config from '~/config';

import subwayLinesPath from '~/data/subway-lines.json';
import subwayStationsPath from '~/data/subway-stations.json';

import {
  IApiMtaTimes,
  IApiSubwayAdvisory,
  IApiSubwayLine,
  IApiSubwayStation,
  IApiTimesByLineId,
} from '~/api/api.interfaces';

import {
  ILineAdvisory,
  IStationLineDirection,
  IStationLineDirectionTime,
} from '~/models/models';

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

export const getAdvisoriesByLineId = async (
  lineId: string,
): Promise<ILineAdvisory[]> => {
  const { baseUrl, getAdvisoryDetail } = config.subwaytimeApi;
  const advisories: IApiSubwayAdvisory[] = await get(
    `${baseUrl}${getAdvisoryDetail}`,
    { lineId },
  );
  return advisories.map(advisory => ({
    id: advisory.SituationNumber,
    reason: advisory.ReasonName,
    summary: advisory.Summary,
    html: advisory.LongDescription,
  }));
};

export const getRawSubwayLines = async (): Promise<IApiSubwayLine[]> => {
  if (!cache.getRawSubwayLines) {
    cache.getRawSubwayLines = await get(subwayLinesPath);
  }
  return cache.getRawSubwayLines;
};

export const getRawSubwayStations = async (): Promise<IApiSubwayStation[]> => {
  if (!cache.getRawSubwayStations) {
    cache.getRawSubwayStations = await get(subwayStationsPath);
  }
  return cache.getRawSubwayStations;
};

export const getRawTimesByLineId = async (
  stationId: string,
): Promise<IApiTimesByLineId> => {
  const { baseUrl, getTime } = config.subwaytimeApi;
  const lineId = stationId.substr(0, 1);
  const mtaTimes: IApiMtaTimes = await get(`${baseUrl}${getTime}`, {
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
          // Because yes.
          if (timeLineId === 'GS') {
            timeLineId = 'S';
          }

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
