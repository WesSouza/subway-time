const config = {
  cityofnewyork: {
    baseUrl: 'https://data.cityofnewyork.us',
    subwayStationsGeoUrl: '/api/views/kk4q-3rt2/rows.json',
  },
  mta: {
    baseUrl: 'http://traintimelb-367443097.us-east-1.elb.amazonaws.com',
    getStationsByLine: '/getStationsByLine/:lineId',
    getSubwaylines: '/getSubwaylines',
    getTime: '/getTime/:lineId/:stationId',
  },
  subwaytime: {
    baseUrl: '/data',
    subwayLines: '/subway-lines.json',
    subwayStations: '/subway-stations.json',
  },
};

module.exports = config;
