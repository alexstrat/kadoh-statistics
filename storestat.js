var cubeGet = require('cube-get');
var _ = require('underscore');
var mapReduce = require('./mapreduce.js');
var timeSeriesMapper = require('./timeseriesmapper.js');

/**
 * [getStoredKeysStatistics description]
 * @param  {[type]}   options [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
exports.getStoredKeysStatistics = function(options, cb) {
  cubeGet.event('heartbeat(keys, id, bot, mobile)',
    options,
    function(events) {

      //aggregation by keys
      var eventsByKeys = mapReduce(events,
        function(event, emit) {
          if(!event.data.keys ||
            event.data.keys.length === 0 ||
            !Array.isArray(event.data.keys)) return;

          event.data.keys.forEach(function(key) {
            emit(key, event);
          })
        },
        function(res, current) {
          res.push(current);
          return res;
        },[]);

      //compute time series for each key
      var timeSeriesByKeys = {};
      _.each(eventsByKeys, function(events, key) {
        timeSeriesByKeys[key] = mapReduce(events,
          timeSeriesMapper(60*1000),
          function(res, event) {
            if(!_.include(res._already, event.data.id)) {
              res._already.push(event.data.id);
              res.tot ++;
              if(event.data.mobile) res.mobile ++;
              if(event.data.bot) res.bot ++;
            }
            return res;
          },
          {tot : 0, bot : 0, mobile : 0, _already : []});
      });

      
      cb(timeSeriesByKeys);
    });
};
