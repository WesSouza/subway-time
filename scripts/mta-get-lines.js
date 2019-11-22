const fs = require('fs');
const got = require('got');
const { resolve } = require('path');

const {
  mta: { baseUrl, getSubwaylines },
} = require('../config');

const unsupportedLines = ['SIR'];

(async () => {
  console.log('Downloading subway lines list...');
  const result = await got(`${baseUrl}${getSubwaylines}`, {
    responseType: 'json',
  });
  const subwayLines = result.body
    .filter(line => !unsupportedLines.includes(line.id))
    .map(({ id }) => ({
      __typename: 'Line',
      id,
    }));
  fs.writeFileSync(
    resolve(__dirname, '../data/subway-lines.json'),
    JSON.stringify(subwayLines, null, 2),
  );
  console.log('Done.');
})().catch(error => console.error(error));
