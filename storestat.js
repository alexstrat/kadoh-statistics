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
  options.step = options.step || 60*1000;
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
          });
        },
        function(res, current) {
          res.push(current);
          return res;
        },function(keys) {
          return [];
        });

      //compute time series for each key
      var timeSeriesByKeys = {};
      _.each(eventsByKeys, function(events, key) {
        timeSeriesByKeys[key] = mapReduce(events,
          timeSeriesMapper(options.step),
          function(res, event) {
            var _res = {
              tot : res.tot,
              bot : res.bot,
              mobile : res.mobile,
              _already : res._already
            };

            if(!_.include(_res._already, event.data.id)) {
              _res._already =  _res._already.concat([event.data.id]);
              _res.tot ++;
              if(event.data.mobile) _res.mobile ++;
              if(event.data.bot) _res.bot ++;
            }
            return _res;
          }, function(key) {
            return {
              tot : 0,
              bot : 0,
              mobile : 0,
              _already : []};
          });
      });

      
      cb(timeSeriesByKeys);
    });
};
