// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/subjects.html
// Subjects
/*
 The Subject class inherits both Observable and Observer, in the sense that it is both an observer and an observable.
 */

var subject = new Rx.Subject();

var subscription = subject.subscribe(
  x => console.log('onNext: ' + x),
  e => console.log('onError: ' + e.message),
  () => console.log('onCompleted')
);
subject.onNext(1); // => onNext: 1
subject.onNext(2); // => onNext: 2
subject.onCompleted(); // => onCompleted
subscription.dispose();

// Every second
var source2 = Rx.Observable.interval(1000);
var subject2 = new Rx.Subject();
var subSource = source2.subscribe(subject2);
var subSubject1 = subject2.subscribe(
  x => console.log('Value published to observer #1: ' + x),
  e => console.log('onError: ' + e.message),
  () => console.log('onCompleted'));
var subSubject2 = subject2.subscribe(
  x => console.log('Value published to observer #2: ' + x),
  e => console.log('onError: ' + e.message),
  () => console.log('onCompleted'));
setTimeout(() => {
  // Clean up
  subject2.onCompleted();
  subSubject1.dispose();
  subSubject2.dispose();
}, 5000);
// => Value published to observer #1: 0
// => Value published to observer #2: 0
// => Value published to observer #1: 1
// => Value published to observer #2: 1
// => Value published to observer #1: 2
// => Value published to observer #2: 2
// => Value published to observer #1: 3
// => Value published to observer #2: 3
// => onCompleted
// => onCompleted