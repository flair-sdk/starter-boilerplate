import { refreshPool } from '../functions/pool';

exports.processEvent = function (event: any, callback: (res: any, error: any) => void) {
  (async () => {
    await refreshPool(event);
  })()
    .then((res) => callback(res, null))
    .catch((error) => callback(null, error));
};
