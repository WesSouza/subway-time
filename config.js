const config = {
  baseUrl: 'http://traintimelb-367443097.us-east-1.elb.amazonaws.com/',
  getStationsByLine: 'getStationsByLine/:lineId',
  getSubwaylines: 'getSubwaylines',
  getTime: 'getTime/:lineId/:stationId',
  subwayStationsGeoUrl:
    'https://data.cityofnewyork.us/api/views/kk4q-3rt2/rows.json',
};

module.exports = config;
