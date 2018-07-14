export interface ILine {
  id: string;
  color: string;
  stations?: IStation[];
  advisories?: ILineAdvisory[];
}

export interface ILineAdvisory {
  id: string;
  reason: string;
  summary: string;
  html: string;
}

export interface IStation {
  id: string;
  name: string;
  boroughName: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  lines: ILine[];
  lineIds: string;
  platforms: IStationLine[];
  distance?: number;
}

export interface IStationLine {
  line: ILine;
  status?: StationPlatformStatus;
  type?: StationPlatformType;
  directions?: IStationLineDirection[];
}

export interface IStationLineDirection {
  name: string;
  times: IStationLineDirectionTime[];
}

export interface IStationLineDirectionTime {
  minutes: number | string;
  lastStationName: string;
}

export enum StationPlatformType {
  alwaysStop = 'ALWAYS_STOP',
  mightSkip = 'MIGHT_SKIP',
  nightsOnly = 'NIGHTS_ONLY',
  rushOnly = 'RUSH_ONLY',
}

export enum StationPlatformStatus {
  normal = 'NORMAL',
  closed = 'CLOSED',
  southboundClosed = 'SOUTHBOUND_CLOSED',
  northboundClosed = 'NORTHBOUND_CLOSED',
}
