/**
 * Simple implementation of the mapReduce pattern.
 * 
 * @param  {[type]} data             [description]
 * @param  {[type]} mapFn            [description]
 * @param  {[type]} reduceFn         [description]
 * @param  {[type]} initReduceResult [description]
 * @return {[type]}                  [description]
 */
var mapReduce = function(data, mapFn, reduceFn, initReduceResult) {
  initReduceResult = (typeof initReduceResult !== 'undefined') ? initReduceResult : {};
  var mapResult = {}, reduceResult = {};

  var emit = function(key, value) {
    if(!mapResult[key]) {
      mapResult[key] = [];
    }
    mapResult[key].push(value);
  };

  data.forEach(function(to_map) {
    mapFn(to_map, emit);
  });
  for(var key in mapResult) {
    reduceResult[key] = mapResult[key].reduce(reduceFn, initReduceResult);
  }

  return reduceResult;
};

module.exports = mapReduce;