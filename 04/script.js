// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/generators_and_observable_sequences.html

function* theMeaningOfLife() {
  yield 42;
}

//var it = theMeaningOfLife();
//it.next(); // => { done: false, value: 42 }
//it.next(); // => { done: true, value: undefined }
for (var v of theMeaningOfLife()) {
  console.log(v);
}


// Async/Await Style and RxJS
var Rx = require('rx');
var request = require('request');
var get = Rx.Observable.fromNodeCallback(request);

Rx.Observable.spawn(function* () {
  var data;
  try {
    data = yield get('http://bing.com').timeout(5000 /*ms*/);
  } catch (e) {
    console.log('Error %s', e);
  }

  console.log(data);
}).subscribe();

// Mixing Operators with Generators
function* fibonacci(){
  var fn1 = 1;
  var fn2 = 1;
  while (1) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    yield current;
  }
}
Rx.Observable.from(fibonacci())
  .take(10)
  .subscribe(x => console.log('Value: %s', x));
//=> Value: 1
//=> Value: 1
//=> Value: 2
//=> Value: 3
//=> Value: 5
//=> Value: 8
//=> Value: 13
//=> Value: 21
//=> Value: 34
//=> Value: 55

var source = Rx.Observable.of(1,2,3)
  .flatMap(
    (x, i) => function* () { yield x; yield i; }(),
    (x, y, i1, i2) => x + y + i1 + i2
  );

var subscription = source.subscribe(
  x => console.log('onNext: %s', x),
  e => console.log('onError: %s', e),
  () => console.log('onCompleted'));
// => Next: 2
// => Next: 2
// => Next: 5
// => Next: 5
// => Next: 8
// => Next: 8
// => Completed