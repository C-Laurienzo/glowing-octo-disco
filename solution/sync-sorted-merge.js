"use strict";

const LogSourceHeap = require("../lib/log-source-heap")

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const logSourceHeap = new LogSourceHeap();

  // Initialize the heap with the earliest log entry from each source
  logSources.forEach(logSource => {
    const logEntry = logSource.pop();

    if (logEntry) {
      logSourceHeap.insert({ logEntry, logSource });
    }
  });

  while (!logSourceHeap.isEmpty()) {
    // Get earliest log entry
    const { logEntry, logSource } = logSourceHeap.extractMin();

    printer.print(logEntry);

    // Get the next log entry from the same log source
    const nextLog = logSource.pop();
    
    if (nextLog) {
      logSourceHeap.insert({ logEntry: nextLog, logSource });
    }
  }

  printer.done();
};
