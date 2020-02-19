import { Endpoints, get } from '~/lib/api';

import {
  Station,
  StationPlatform,
  StationPlatformDirection,
  StationPlatformDirectionTime,
} from './types';

interface ApiStation {
  id: string;
  lineId: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface ApiStationPlatform {
  name: string;
  times: ApiStationPlatformTime[];
}

interface ApiStationPlatformTime {
  route: string;
  lastStation: string;
  minutes: string | number;
}

interface ApiStationTimes {
  [key: string]: ApiStationPlatform | ApiStationTimesMessage;
}

interface ApiStationTimesMessage {
  errorCode: string;
  message: string;
  messageType: ApiStationTimesMessageTypes;
}

enum ApiStationTimesMessageTypes {
  Success = 'SUCCESS',
  Error = 'ERROR',
}

export const apiStations = async (): Promise<{
  [stationId: string]: Station;
}> => {
  const apiStations = await get<ApiStation[]>(Endpoints.Stations);
  const stationsById: { [stationId: string]: Station } = {};
  apiStations.forEach(apiStation => {
    if (!stationsById[apiStation.id]) {
      const keywords: string[] = [];
      const { id, name, latitude, longitude } = apiStation;

      if (name.startsWith('N ')) {
        keywords.push('north');
      }

      if (name.startsWith('E ')) {
        keywords.push('east');
      }

      if (name.startsWith('W ')) {
        keywords.push('west');
      }

      if (name.startsWith('S ')) {
        keywords.push('south');
      }

      const numberMatches = name.matchAll(/(\d+) (St|Av)/g);
      if (numberMatches) {
        for (const numberMatch of numberMatches) {
          const number = numberMatch[1];
          const lastNumber = number.charAt(number.length - 1);

          if (lastNumber === '1' && number !== '11') {
            keywords.push(`${number}st`);
          } else if (lastNumber === '2' && number !== '12') {
            keywords.push(`${number}nd`);
          } else if (lastNumber === '3' && number !== '13') {
            keywords.push(`${number}rd`);
          } else {
            keywords.push(`${number}th`);
          }
        }
      }

      stationsById[apiStation.id] = {
        id,
        keywords,
        latitude,
        lineIds: [],
        longitude,
        name,
      };
    }
    stationsById[apiStation.id].lineIds.push(apiStation.lineId);
  });

  return stationsById;
};

export const apiStationPlatformsByStationId = async (
  stationId: string,
): Promise<StationPlatform[]> => {
  const lineId = stationId.substr(0, 1);
  const apiStationTimesProperties = await get<ApiStationTimes>(
    Endpoints.StationTrainTimes,
    {
      lineId,
      stationId,
    },
  );

  // TypeScript doesn't allow objects with defined property names and dynamic
  // property names. This is one of the oddities so it understands we're
  // targeting the key 'messages'.
  if (
    'message' in apiStationTimesProperties &&
    'message' in apiStationTimesProperties.message
  ) {
    const { message, messageType } = apiStationTimesProperties.message;
    if (messageType !== ApiStationTimesMessageTypes.Success) {
      throw new Error(message);
    }
  }

  const timesByLineAndDirection: {
    [lineId: string]: {
      [directionName: string]: StationPlatformDirectionTime[];
    };
  } = {};

  Object.keys(apiStationTimesProperties).forEach(key => {
    const apiStationPlatform = apiStationTimesProperties[key];
    if (
      !apiStationPlatform ||
      typeof apiStationPlatform !== 'object' ||
      !('name' in apiStationPlatform)
    ) {
      return;
    }

    const { name: directionName, times } = apiStationPlatform;

    times.forEach(
      ({ lastStation: lastStationName, minutes, route: lineId }) => {
        // Because yes.
        if (lineId === 'GS') {
          lineId = 'S';
        }
        if (lineId.match(/x$/i)) {
          lineId = lineId.replace(/x$/i, '');
        }

        if (!timesByLineAndDirection[lineId]) {
          timesByLineAndDirection[lineId] = {};
        }

        if (!timesByLineAndDirection[lineId][directionName]) {
          timesByLineAndDirection[lineId][directionName] = [];
        }

        timesByLineAndDirection[lineId][directionName].push({
          lastStationName,
          minutes,
        });
      },
    );
  });

  const stationPlatforms: StationPlatform[] = [];
  Object.keys(timesByLineAndDirection).forEach(lineId => {
    const stationPlatform: StationPlatform = {
      lastUpdate: new Date(),
      lineId,
      directions: [],
    };

    const directions = timesByLineAndDirection[lineId];
    Object.keys(directions).forEach(directionName => {
      const stationPlatformDirection: StationPlatformDirection = {
        name: directionName,
        times: directions[directionName],
      };

      stationPlatform.directions.push(stationPlatformDirection);
    });

    stationPlatforms.push(stationPlatform);
  });

  return stationPlatforms;
};
