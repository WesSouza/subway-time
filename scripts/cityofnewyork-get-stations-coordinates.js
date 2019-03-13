const fs = require('fs');
const got = require('got');
const { resolve } = require('path');

const parseLines = lines => {
  lines = lines.replace(/\s+express\s*/i, '');
  if (lines.includes('J')) {
    lines += 'Z';
  }
  if (lines.includes('R')) {
    lines += 'N';
  }
  return lines;
};

const parseCoordinates = coordinatesString => {
  const matches = coordinatesString.match(/POINT \(([-0-9\.]+) ([-0-9\.]+)\)/);
  if (!matches) {
    return [null, null];
  }

  const [, longitude, latitude] = matches;
  return { latitude, longitude };
};

const {
  cityofnewyork: { baseUrl, subwayStationsGeoUrl },
} = require('./config');

(async () => {
  console.log(`Downloading coordinates...`);

  let result = await got(`${baseUrl}${subwayStationsGeoUrl}`, {
    json: true,
  });

  if (!result.body || !result.body.data.length) {
    throw new Error('No results.');
  }

  const stations = result.body.data.map(
    ([, id, , , , , , , , order, name, coordinates, lines, notes]) => ({
      __typename: 'LineCoordinate',
      id,
      order: Number(order),
      lines: parseLines(lines),
      name,
      coordinates: parseCoordinates(coordinates),
      notes,
    }),
  );

  fs.writeFileSync(
    resolve(__dirname, '../data/subway-stations-coordinates.json'),
    JSON.stringify(stations, null, 2),
  );
  console.log('Done.');
})().catch(error => console.error(error));
