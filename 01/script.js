// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/creating_and_subscribing_to_simple_observable_sequences.html

//--- From array
// Creates an observable sequence of 5 integers, starting from 1
var source1 = Rx.Observable.range(1, 5);
// Prints out each item
var subscription1 = source1.subscribe(
  x => console.log('onNext 1: ' + x),
  e => console.log('onError 1: ' + e.message),
  () => console.log('onCompleted 1')
);

//--- From callback
var source2 = Rx.Observable.create(observer => {
  // Yield a single value and complete
  observer.onNext(42);
  observer.onCompleted();

  // Any cleanup logic might go here
  return () => console.log('disposed')
});

var subscription2 = source2.subscribe(
  x => console.log('onNext 2: %s', x),
  e => console.log('onError 2: %s', e),
  () => console.log('onCompleted 2')
);

// => onNext: 42
// => onCompleted
subscription2.dispose();
// => disposed

//--- From timer
console.log('Current time 3: ' + Date.now());

var source3 = Rx.Observable.timer(
  5000, /* 5 seconds */
  1000 /* 1 second */)
  .timestamp();

var subscription3 = source3.subscribe(
  x => console.log(`3 ${x.value}: ${x.timestamp}`)
);
setTimeout(() => {
  subscription3.dispose();
}, 6000);

//--- From generator function
function* fibonacci() {
  var fn1 = 1;
  var fn2 = 1;
  while (1) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    yield current;
  }
}
// Converts a generator to an observable sequence
var source4 = Rx.Observable.from(fibonacci()).take(5);

// Prints out each item
var subscription4 = source4.subscribe(
  x => console.log('onNext 4: %s', x),
  e => console.log('onError 4: %s', e),
  () => console.log('onCompleted 4')
);

//--- Multiple subscriptions
var source = Rx.Observable.interval(1000);

var subscription5 = source.subscribe(
  x => console.log('Observer 5: onNext: ' + x),
  e => console.log('Observer 5: onError: ' + e.message),
  () => console.log('Observer 5: onCompleted')
);

var subscription6 = source.subscribe(
  x => console.log('Observer 6: onNext: ' + x),
  e => console.log('Observer 6: onError: ' + e.message),
  () => console.log('Observer 6: onCompleted')
);

setTimeout(() => {
  subscription5.dispose();
  subscription6.dispose();
}, 5000);