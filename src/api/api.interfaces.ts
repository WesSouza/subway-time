import {
  IStationLineDirection,
  StationPlatformStatus,
  StationPlatformType,
} from 'models/models';

export interface IRawSubwayAdvisory {
  SituationNumber: string;
  ReasonName: string;
  Summary: string;
  LongDescription: string;
}

export interface IRawSubwayLine {
  __typename: string;
  id: string;
  color: string;
}

export interface IRawSubwayStation {
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

export interface IRawTimesByLineId {
  [i: string]: IStationLineDirection[];
}

export interface IRawMtaTimes {
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
