const config = {
  subwayTime: {
    baseUrl: '/data',
    subwayLines: '/subway-lines.json',
    subwayStations: '/subway-stations.json',
  },
  mta: {
    baseUrl: 'http://traintimelb-367443097.us-east-1.elb.amazonaws.com',
    getStationsByLine: '/getStationsByLine/:lineId',
    getSubwaylines: '/getSubwaylines',
    getTime: '/getTime/:lineId/:stationId',
  },
  cityofnewyork: {
    baseUrl: 'https://data.cityofnewyork.us',
    subwayStationsGeoUrl: '/api/views/kk4q-3rt2/rows.json',
  },
};

module.exports = config;
