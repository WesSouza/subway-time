module.exports = {
  camsys: {
    baseUrl: 'http://otp-mta-demo.camsys-apps.com',
    stops: '/otp/routers/default/index/stops',
  },
  cityofnewyork: {
    baseUrl: 'https://data.cityofnewyork.us',
    subwayStationsGeoUrl: '/api/views/kk4q-3rt2/rows.json',
  },
  mta: {
    baseUrl: 'http://traintimelb-367443097.us-east-1.elb.amazonaws.com',
    getAdvisoryDetail: '/getAdvisoryDetail/:lineId',
    getStationsByLine: '/getStationsByLine/:lineId',
    getSubwaylines: '/getSubwaylines',
    getTime: '/getTime/:lineId/:stationId',
  },
  subwaytime: {
    baseUrl: '/data',
    subwayLines: '/subway-lines.json',
    subwayStations: '/subway-stations.json',
  },
  subwaytimeApi: {
    baseUrl: '/api',
    getAdvisoryDetail: '/getAdvisoryDetail/:lineId',
    getTime: '/getTime/:lineId/:stationId',
  },
};
