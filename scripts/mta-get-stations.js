const fs = require('fs');
const got = require('got');
const { resolve } = require('path');

const mapStatusCodeToEnum = status => {
  switch (String(status).trim()) {
    case 'undefined':
      return 'NORMAL';
    case '-1':
      return 'CLOSED';
    case '-2':
      return 'SOUTHBOUND_CLOSED';
    case '-3':
      return 'NORTHBOUND_CLOSED';
  }

  return 'UNKNOWN';
};

const mapTypeToEnum = type => {
  switch (String(type).trim()) {
    case '0':
      return 'ALWAYS_STOP';
    case '1':
      return 'MIGHT_SKIP';
    case '2':
      return 'NIGHTS_ONLY';
    case '3':
      return 'RUSH_ONLY';
    case '4':
      return 'RUSH_ONLY';
  }

  return 'UNKNOWN';
};

const {
  mta: { baseUrl, getStationsByLine },
} = require('./config');

(async () => {
  console.log('Opening data/subway-lines.json...');
  const lines = require('../data/subway-lines.json');

  const subwayStations = [];

  console.log('Downloading stations...');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    console.log(`Downloading stations from line ${line.id}...`);

    const url = `${baseUrl}${getStationsByLine}`.replace(':lineId', line.id);
    let result = await got(url, {
      json: true,
    });
    result = JSON.parse(result.body);

    if (!result || !result.length) {
      continue;
    }

    const [{ color }] = result;
    if (color) {
      line.color = color;
    }

    result.forEach(({ borough, stations }) => {
      stations.forEach(({ id, name, status, type }) => {
        subwayStations.push({
          __typename: 'Station',
          id,
          lineId: line.id,
          lineColor: color,
          boroughName: borough,
          name,
          status: mapStatusCodeToEnum(status),
          type: mapTypeToEnum(type),
        });
      });
    });
  }

  fs.writeFileSync(
    resolve(__dirname, '../data/subway-lines.json'),
    JSON.stringify(lines, null, 2),
  );

  fs.writeFileSync(
    resolve(__dirname, '../data/subway-stations.json'),
    JSON.stringify(subwayStations, null, 2),
  );
  console.log('Done.');
})().catch(error => console.error(error));
