var fs = require('fs');
var dateFormat = require('dateformat');
var storesStats = require('./storestat.js');
var _ = require('underscore');

storesStats.getStoredKeysStatistics({
  host : 'evaluator.kadoh.fr.nf',
  start : 'now-9d8h',
  over : '12h'
}, function(res) {
  _.each(res, function(v, k) {
    console.log('\n'+k+' : '+_.size(v));

    fs.writeFileSync(__dirname+ '/data/25jun-storedkeys/'+k+'.csv',
    _.map(v, function(d, date) {
      return [dateFormat(date, 'dd/mm/yyyy HH:MM:ss'),
        d.tot,
        d.tot-d.bot,
        d.mobile].join(',');
    }).join('\n'));
  });
});