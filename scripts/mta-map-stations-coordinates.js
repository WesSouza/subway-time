const assert = require('assert').strict;
const fs = require('fs');
const got = require('got');
const { resolve } = require('path');

const {
  camsys: { baseUrl, stops: pathStops },
} = require('./config');

const { CAMSYS_APIKEY } = process.env;

assert(CAMSYS_APIKEY, 'CAMSYS_APIKEY not defined');

const stopsFromCamsys = new Map();

(async () => {
  console.log(`Downloading stations...`);

  const url = `${baseUrl}${pathStops}?apikey=${CAMSYS_APIKEY}`;
  const mtaStops = await got(url, { responseType: 'json' });

  mtaStops.body.forEach((stop) => {
    if (
      !stop.id.startsWith('MTASBWY:') ||
      !stop.parentStation ||
      stopsFromCamsys.has(stop.parentStation)
    ) {
      return;
    }
    stopsFromCamsys.set(stop.parentStation, {
      id: stop.parentStation,
      latitude: stop.lat,
      longitude: stop.lon,
      name: stop.name,
    });
  });

  const subwayStations = require('../data/subway-stations.json');

  for (const station of subwayStations) {
    const { id } = station;
    const stopFromCamsys = stopsFromCamsys.get(id);
    if (!stopFromCamsys) {
      continue;
    }

    station.name = stopFromCamsys.name;
    station.latitude = stopFromCamsys.latitude;
    station.longitude = stopFromCamsys.longitude;
  }

  fs.writeFileSync(
    resolve(__dirname, '../data/subway-stations.json'),
    JSON.stringify(subwayStations, null, 2),
  );
  console.log('Done.');
})().catch((error) => console.error(error));
