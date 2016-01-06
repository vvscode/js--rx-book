// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/querying_observable_sequences.html
var source1 = Rx.Observable.range(1, 3);
var source2 = Rx.Observable.range(1, 3);

// concat gives [1,2,3,1,2,3] but merge gives [1,1,2,2,3,3]
console.log('Concat');
source1
  .concat(source2)
  .subscribe(console.log.bind(console));
console.log('Merge');
source1
  .merge(source2)
  .subscribe(console.log.bind(console));

// if source1 completes without any error, then source2 will not start ( will be ignored )
console.log('Catch');
source1
  .catch(source2)
  .subscribe(console.log.bind(console));

// f you expect either source sequence to produce any error, it is a safer bet to use onErrorResumeNext to guarantee that the subscriber will still receive some values.
console.log('onErrorResumeNext');
Rx.Observable
  .throw(new Error('An error has occurred.'))
  .onErrorResumeNext(source2)
  .subscribe(console.log.bind(console));


// Projection
console.log('Projection');
Rx.Observable
  .from( ['Reactive', 'Extensions', 'RxJS'])
  .map(x =>x.length)
  .subscribe(console.log.bind(console));

Rx.Observable
  .fromEvent(document, 'mousemove')
  .map(e => ({x: e.clientX, y: e.clientY }))
  .subscribe((pos) => console.log('Mouse at point ' + pos.x + ', ' + pos.y));


var invervalSource = Rx.Observable.interval(5000).take(2);
var proj = Rx.Observable.range(100, 3);
var resultSeq = invervalSource.flatMap(proj);

var subscription = resultSeq.subscribe(
  x => console.log('onNext: %s', x),
  e => console.log('onError: %s', e.message),
  () => console.log('onCompleted'));

// => onNext: 100
// => onNext: 101
// => onNext: 102
// => onNext: 100
// => onNext: 101
// => onNext: 102
// => onCompleted

// Filtering
console.log('Filtering');
// it takes an initial state (0 in our example), a conditional function to terminate (fewer than 10 times), an iterator (+1), a result selector (a square function of the current value)
Rx.Observable.generate(
  0,
  i => i < 10,
  i => i + 1,
  i => i * i)
  // prints out only those smaller than 5
  .filter(n => n < 5)
  .subscribe(
    (x) => console.log('onNext: %s', x),
    (e) => console.log('onError: %s', e.message),
    () => console.log('onCompleted')
  );

Rx.Observable
  .fromEvent(document, 'mousemove')
  .filter(pos => pos.x === pos.y)
  .subscribe(pos => console.log('mouse at ' + pos.x + ', ' + pos.y));


// Time-based Operation
console.log('Time-based operations');
/*
 create a simple sequence of integers for every second.
 We then use the bufferWithCount operator and specify that each buffer will hold 5 items from the sequence.
 The onNext is called when the buffer is full. We then tally the sum of the buffer using calling Array.reduce.
 The buffer is automatically flushed and another cycle begins.
 The printout will be 10, 35, 60… in which 10=0+1+2+3+4, 35=5+6+7+8+9, and so on.
 */
Rx.Observable
  .interval(1000)
  .bufferWithCount(5)
  .map(arr => arr.reduce((acc, x) => acc + x, 0))
  .subscribe(console.log.bind(console));

/*
 create a buffer with a specified time span in milliseconds.
 In the following example, the buffer will hold items that have accumulated for 3 seconds.
 The printout will be 3, 12, 21… in which 3=0+1+2, 12=3+4+5, and so on.
 */
Rx.Observable
  .interval(1000)
  .bufferWithTime(3000)
  .map(arr => arr.reduce((acc, x) => acc + x, 0))
  .subscribe(console.log.bind(console));

// Note that if you are using any of the buffer* or window* operators,
// you have to make sure that the sequence is not empty before filtering on it.