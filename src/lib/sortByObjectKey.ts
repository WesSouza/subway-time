interface IObject {
  [s: string]: any;
}

const sortByObjectKey = (key: string) => (
  objectA: IObject,
  objectB: IObject,
) => {
  if (objectA[key] > objectB[key]) {
    return -1;
  }
  if (objectA[key] < objectB[key]) {
    return 1;
  }
  return 0;
};

export default sortByObjectKey;
