var mapReduce = require('./mapreduce.js');

var data = [ 'jan piet klaas', 'piet klaas', 'japie' ];

var result = mapReduce (data, function(item, emit) {
  var splitted = item.split(/\s/g);
  for(var word in splitted) {
    emit(splitted[word], 1);
  }
}, function(res, value) {
  return res + value;
},
0);

console.log(result);