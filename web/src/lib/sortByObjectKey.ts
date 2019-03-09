import naturalCompare from 'natural-compare-lite';

interface IObject {
  [s: string]: any;
}

const sortByObjectKey = (key: string) => (objectA: IObject, objectB: IObject) =>
  naturalCompare(objectA[key], objectB[key]);

export default sortByObjectKey;
