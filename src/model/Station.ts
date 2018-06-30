export interface IStation {
  __typename: string;
  id: string;
  lineId: string;
  boroughName: string;
  name: string;
  status: string;
  type: string;
  coordinates?: {
    lat: string;
    lon: string;
  };
}
