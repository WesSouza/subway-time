export const getCurrentPosition = async (): Promise<Position> =>
  new Promise<Position>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
