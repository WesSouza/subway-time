import {
  IStationLineDirection,
  StationPlatformStatus,
  StationPlatformType,
} from '~/models/models';

export interface IApiSubwayAdvisory {
  SituationNumber: string;
  ReasonName: string;
  Summary: string;
  LongDescription: string;
}

export interface IApiSubwayLine {
  __typename: string;
  id: string;
  color: string;
}

export interface IApiSubwayStation {
  __typename: string;
  id: string;
  lineId: string;
  lineColor: string;
  boroughName: string;
  name: string;
  status: StationPlatformStatus;
  type: StationPlatformType;
  latitude: number;
  longitude: number;
}

export interface IApiTimesByLineId {
  [i: string]: IStationLineDirection[];
}

export interface IApiMtaTimes {
  lastUpdatedTime: string;
  lastUpdatedOn: number;
  stationName: string;
  message: {
    message: string;
    messageType: RawMtaTimesMessageType;
    errorCode: string;
  };
}

enum RawMtaTimesMessageType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
