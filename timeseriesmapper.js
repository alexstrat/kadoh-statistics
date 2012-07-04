/**
 * Map function to get time series.
 *
 * Interval in millisecond.
 * 
 * @param  {[type]} interval [description]
 * @param  {[type]} options  [description]
 * @return {[type]}          [description]
 */
var timeSeriesMapper = function(interval, options) {

  options = options || {};
  //time key in the value
  options.time = options.time || 'time';

  return function timeSeriesMapFn(value, emit) {
    var floor = new Date(Math.floor(value[options.time] / interval) * interval);
    emit(floor, value);
  };
};

module.exports = timeSeriesMapper;