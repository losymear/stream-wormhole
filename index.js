'use strict';

module.exports = (stream, throwError) => {
  return new Promise((resolve, reject) => {
    if (stream._readableState && stream._readableState.ended) {
      return resolve();
    }
    if (!stream.readable || stream.destroyed) {
      return resolve();
    }

    stream.resume();

    function cleanup() {
      stream.removeListener('end', onEnd);
      stream.removeListener('close', onEnd);
      stream.removeListener('close', onError);
    }

    function onEnd() {
      cleanup();
      resolve();
    }

    function onError(err) {
      cleanup();
      // don't throw error by default
      if (throwError) {
        reject(err);
      } else {
        resolve();
      }
    }

    stream.on('end', onEnd);
    stream.on('close', onEnd);
    stream.on('error', onError);
  });
};
