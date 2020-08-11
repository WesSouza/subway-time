module.exports = {
  camsys: {
    baseUrl: 'http://otp-mta-demo.camsys-apps.com',
    stops: '/otp/routers/default/index/stops',
  },
  mta: {
    baseUrl: 'http://traintimelb-367443097.us-east-1.elb.amazonaws.com',
    getAdvisoryDetail: '/getAdvisoryDetail/:lineId',
    getStationsByLine: '/getStationsByLine/:lineId',
    getSubwaylines: '/getSubwaylines',
    getTime: '/getTime/:lineId/:stationId',
  },
};
