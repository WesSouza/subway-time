const fs = require('fs');
const got = require('got');
const { resolve } = require('path');

const extraLineIds = {
  Z: 'J',
  N: 'R',
};

const flattenReplacements = [
  [/104th-102nd sts/gi, '104 st'],
  [/4th av - 9th st/gi, '9 st'],
  [/5th ave - bryant pk/gi, '5 av'],
  [/archer av - jfk airport/gi, 'archer av'],
  [/archer av\/jfk airport/gi, 'archer av'],
  [/barclay's center/gi, ''],
  [/bay pky/gi, ' bay pkwy'],
  [/beverley/gi, 'beverly'],
  [/bushwick av - aberdeen st/gi, 'bushwick - aberdeen'],
  [/canal st - holland tunnel/gi, 'canal st - 6 av'],
  [/delancey st - essex st/gi, 'essex st'],
  [/fulton mal/gi, ''],
  [/gravesend - 86th st/gi, '86 st'],
  [/hoyt st - schermerhorn st/gi, 'hoyt - schermerhorn sts'],
  [/hoyt street-schermerhorn street/gi, 'hoyt - schermerhorn sts'],
  [/hudson yards/gi, ''],
  [/jfk airport - 159 av/gi, 'jfk airport'],
  [/lexington av 59 st/gi, '59 st'],
  [/lexington av\/ 59 st/gi, '59 st'],
  [/lexington ave - 59th st/gi, '59 st'],
  [/long island city - court sq/gi, 'court sq'],
  [/lower east side - 2nd ave/gi, '2 av'],
  [/museum of natural history/gi, ''],
  [/newkirk plaza/gi, 'newkirk av'],
  [/park place - franklin av - classon av/gi, 'franklin ave - fulton st'],
  [/penn station - 8 av/gi, 'penn station'],
  [/port authority bus terminal - 8 av/gi, 'port authority bus terminal'],
  [/roosevelt island - main st/gi, 'roosevelt island'],
  [/sheperd/gi, 'shepherd'],
  [/union sq - 14th st/gi, '14 st'],
  [/west/gi, 'w'],
  [/whitehall st-south ferry/gi, 'whitehall st'],

  [/\([^\)]+\)/gi, ''],
  [/(\d)(st|nd|rd|th)/gi, '$1'],
  [/ave(nue)?/gi, 'av'],
  [/bklyn/gi, 'brooklyn'],
  [/boulevard/gi, 'blvd'],
  [/center/gi, 'ctr'],
  [/drive/gi, 'dr'],
  [/fort/gi, 'ft'],
  [/heights/gi, 'hts'],
  [/highway/gi, 'hwy'],
  [/junction/gi, 'jct'],
  [/parkway/gi, 'pkwy'],
  [/plaza/gi, 'plz'],
  [/road/gi, 'rd'],
  [/street/gi, 'st'],
  [/square/gi, 'sq'],
  [/terminal/gi, 'term'],
];

const flattenName = name => {
  flattenReplacements.forEach(([regexp, replacement]) => {
    name = name.replace(regexp, replacement);
  });
  name = name.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return name;
};

const truncateName = name => name.replace(/[-\/].+$/, '');

const find = ({
  coordinateNameFlattened,
  coordinateNameTruncated,
  lineRegex,
  lines,
  nameFlattened,
  nameFlippedFlattened,
  nameTruncated,
}) => {
  if (!lines.match(lineRegex)) {
    return 0;
  }

  switch (true) {
    case coordinateNameFlattened === nameFlattened:
      return 1;
    case coordinateNameFlattened === nameFlippedFlattened:
      return 0.9;
    case coordinateNameTruncated === nameTruncated:
      return 0.6;
    case coordinateNameFlattened === nameTruncated:
      return 0.5;
  }
  return 0;
};

const flipByDash = name =>
  name
    .split(/-/g)
    .reverse()
    .join('-');

(async () => {
  console.log('Opening data/subway-stations.json...');
  const stations = require('../../data/subway-stations.json');

  console.log('Opening data/subway-stations-coordinates.json...');
  let coordinates = require('../../data/subway-stations-coordinates.json');
  coordinates = coordinates.map(coordinate => ({
    ...coordinate,
    nameFlattened: flattenName(coordinate.name),
    nameTruncated: flattenName(truncateName(coordinate.name)),
  }));

  const stationsWithCoordinates = [];

  stations.forEach((station, index) => {
    const { __typename, id, lineId, boroughName, name, status, type } = station;

    const extraLineId = extraLineIds[lineId] || '';
    const lineRegex = new RegExp(`(^|-)[${lineId}${extraLineId}]`);

    const nameFlattened = flattenName(name);
    const nameFlippedFlattened = flattenName(flipByDash(name));
    const nameTruncated = flattenName(truncateName(name));
    let stationsWithName = coordinates
      .map(station => {
        const {
          nameFlattened: coordinateNameFlattened,
          nameTruncated: coordinateNameTruncated,
          lines,
        } = station;

        const weight = find({
          coordinateNameFlattened,
          coordinateNameTruncated,
          lineRegex,
          lines,
          nameFlattened,
          nameFlippedFlattened,
          nameTruncated,
        });

        if (weight === 0) {
          return false;
        }

        return {
          ...station,
          weight,
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.weight - left.weight);
    if (stationsWithName.length === 0) {
      console.warn(
        `Unable to match coordinates for station ${lineId} ${id} ${name}.`,
      );
      return;
    }

    const { coordinates: stationCoordinates } = stationsWithName[0];

    stationsWithCoordinates.push({
      ...station,
      coordinates: stationCoordinates,
    });
  });

  fs.writeFileSync(
    resolve(__dirname, '../../data/subway-stations.json'),
    JSON.stringify(stationsWithCoordinates, null, 2),
  );
  console.log('Done.');
})().catch(error => console.error(error));
