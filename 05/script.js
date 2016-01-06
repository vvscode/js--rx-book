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

