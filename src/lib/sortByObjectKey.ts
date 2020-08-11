import naturalCompare from 'natural-compare-lite';

interface AnyObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [s: string]: any;
}

const sortByObjectKey = (key: string) => (
  objectA: AnyObject,
  objectB: AnyObject,
) => naturalCompare(objectA[key], objectB[key]);

export default sortByObjectKey;
