const promises = {};

export const cacheAsyncCalls = <T>(
  key: string,
  fn: (...args: any[]) => Promise<T>,
) => (...args: any[]): Promise<T> => {
  if (!promises[key]) {
    promises[key] = new Promise((resolve, reject) => {
      setTimeout(() => {
        fn(...args)
          .then((result: T) => {
            resolve(result);
          })
          .catch(reject);
      }, 40);
    });
  }

  return promises[key];
};
