var storesStats = require('./storestat.js');

storesStats.getStoredKeysStatistics({
  host : 'evaluator.kadoh.fr.nf',
  start : 'now-10m',
  over : '10m'
}, function(res) {console.log(Object.keys(res))});