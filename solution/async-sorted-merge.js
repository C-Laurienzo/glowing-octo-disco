"use strict";

const LogSourceHeap = require("../lib/log-source-heap")

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    const logSourceHeap = new LogSourceHeap();
    const promises = [];

    // Initialize the heap with the earliest log entry from each source
    logSources.map(logSource => {
      const popPromise = logSource.popAsync()
        .then((logEntry) => {
          if (logEntry) {
            logSourceHeap.insert({ logEntry, logSource });
          }
        })
        .catch(reject);

      promises.push(popPromise);
    });

    Promise.all(promises).then(() => resolve(logSourceHeap)).catch(reject);
  }).then(async (logSourceHeap) => {
    const promises = [];

    while (!logSourceHeap.isEmpty()) {
      // Get earliest log entry
      const { logEntry, logSource } = logSourceHeap.extractMin();

      printer.print(logEntry);

      // Get the next log entry from the same log source
      const nextLogPromise = logSource.popAsync().then((nextLog) => {
        if (nextLog) {
          logSourceHeap.insert({ logEntry: nextLog, logSource });
        }
      });

      promises.push(nextLogPromise);
    }

    await Promise.all(promises);
  }).then(() => printer.done());
};
