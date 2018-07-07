const shallowObjectEqual = (objectA?: object, objectB?: object) => {
  if (!objectA && !objectB) {
    return true;
  }
  if (!objectA || !objectB) {
    return false;
  }

  let equalValues = 0;
  let equal = true;
  Object.keys(objectA).every(key => {
    if (!objectB.hasOwnProperty(key) || objectA[key] !== objectB[key]) {
      equal = false;
      return false;
    }
    equalValues += 1;
    return true;
  });

  if (equal && equalValues !== Object.keys(objectB).length) {
    return false;
  }

  return equal;
};

export default shallowObjectEqual;
