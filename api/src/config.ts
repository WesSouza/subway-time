export default {
  mta: {
    baseUrl: 'http://traintimelb-367443097.us-east-1.elb.amazonaws.com',
    getAdvisoryDetail: '/getAdvisoryDetail/:lineId',
    getStationsByLine: '/getStationsByLine/:lineId',
    getSubwayLines: '/getSubwaylines',
    getTime: '/getTime/:lineId/:stationId',
  },
};
