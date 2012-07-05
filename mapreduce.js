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
    var _init = (typeof initReduceResult ==='function') ?
                initReduceResult(key) : initReduceResult;
    reduceResult[key] = mapResult[key].reduce(reduceFn, _init);
  }

  return reduceResult;
};

module.exports = mapReduce;