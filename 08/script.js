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

// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/scheduling_and_concurrency.html
// Using Schedulers
/*
 A scheduler controls when a subscription starts and when notifications are published.
 - ImmediateScheduler will start the specified action immediately
 - CurrentThreadScheduler will schedule actions to be performed on the thread that makes the original call
 - DefaultScheduler will schedule actions to be performed on a asynchronous callback,
 which is optimized for the particular runtime, such as setImmediate or process.nextTick on Node.js
 or in the browser with a fallback to setTimeout
 */
Rx.Observable.generate(
  0,
  () => true,
  x => x + 1,
  x => x
  )
  .observeOn(Rx.Scheduler.default)
  .subscribe(
    console.log.bind(console)
  );
/*
 Instead of using the observeOn operator to change the execution context on which the observable sequence produces messages,
 we can create concurrency in the right place to begin with.
 */
Rx.Observable.generate(
  0,
  () => true,
  x => x + 1,
  x => x,
  Rx.Scheduler.default)
  .subscribe(
    console.log.bind(console)
  );
/*
 It is best to place observeOn later in the query. This is because a query will potentially filter out a lot of messages,
 and placing the observeOn operator earlier in the query would do extra work on messages that would be filtered out anyway.
 Calling the observeOn operator at the end of the query will create the least performance impact.
 */
/*
//Another advantage of specifying a scheduler type explicitly is that you can introduce concurrency for performance purpose, as illustrated by the following code.
 seq.groupBy(...)
  .map(x => x.observeOn(Rx.Scheduler.default))
  .map(x => expensive(x))  // perform operations that are expensive on resources
*/

/* CHEATSHEET : When to Use Which Scheduler
Scenario	                  => Scheduler
Constant Time Operations	  => Rx.Scheduler.immediate
Tail Recursive Operations	  => Rx.Scheduler.immediate
Iteration Operations	      => Rx.Scheduler.currentThread
Time-based Operations	      => Rx.Scheduler.default
Asynchronous Conversions	  => Rx.Scheduler.default
Historical Data Operations  =>	Rx.HistoricalScheduler
Unit Testing	              => Rx.TestScheduler
*/





