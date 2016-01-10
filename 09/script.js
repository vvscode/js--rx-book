// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/testing_and_debugging.html
/*
 The RxJS library provides the TestScheduler type to assist testing this kind of time-dependent code without actually waiting for time to pass.
 The TestScheduler inherits VirtualScheduler and allows you to create, publish and subscribe to sequences in emulated time.
 */

/*
 The following example creates a hot observable sequence with specified onNext notifications.
 It then starts the test scheduler and specifies when to subscribe to and dispose of the hot observable sequence.
 The Start method returns an instance of an Observer, which contains a messages property that records all notifications in a list.
 */
// Using QUnit testing for assertions
if (false && 'I know how to fix next broken code') {
  alert('Next code is broken cause changing interface on updating from v3 to v4');
  function createMessage(actual, expected) {
    return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
  }

// Using QUnit testing for assertions
  var collectionAssert = {
    assertEqual: (expected, actual) => {
      var comparer = Rx.internals.isEqual, isOk = true;

      if (expected.length !== actual.length) {
        ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
        return;
      }

      for (var i = 0, len = expected.length; i < len; i++) {
        isOk = comparer(expected[i], actual[i]);
        if (!isOk) {
          break;
        }
      }

      ok(isOk, createMessage(expected, actual));
    }
  };

  var onNext = Rx.ReactiveTest.onNext, onCompleted = Rx.ReactiveTest.onCompleted, subscribe = Rx.ReactiveTest.subscribe;

  test('buffer should join strings', () => {

    var scheduler = new Rx.TestScheduler();

    var input = scheduler.createHotObservable(onNext(100, 'abc'), onNext(200, 'def'), onNext(250, 'ghi'), onNext(300, 'pqr'), onNext(450, 'xyz'), onCompleted(500));

    var results = scheduler.startWithTiming(function() {
        return input.buffer(() => input.debounce(100, scheduler))
          .map(b => b.join(','));
      },
      50,  // created
      150, // subscribed
      600  // disposed
    );

    collectionAssert.assertEqual(results.messages, [onNext(400, 'def,ghi,pqr'), onNext(500, 'xyz'), onCompleted(500)]);

    collectionAssert.assertEqual(input.subscriptions, [subscribe(150, 500), subscribe(150, 400), subscribe(400, 500)]);
  });
}

// Debugging your Rx application
/*
 You can use the do operator to debug your Rx application.
 The do operator allows you to specify various actions to be taken for each item of observable sequence (e.g., print or log the item, etc.).
 This is especially helpful when you are chaining many operators and you want to know what values are produced at each level.
 */
var seq1 = Rx.Observable.interval(1000)
  .do(console.log.bind(console))
  .bufferWithCount(5)
  .do(x => console.log('buffer is full'))
  .subscribe(x => console.log('Sum of the buffer is ' + x.reduce((acc, x) => acc + x, 0)));
// => 0
// => 1
// => 2
// => 3
// => 4
// => buffer is full
// => Sum of the buffer is 10
// ...

/*
 You can also use the timestamp operator to verify the time when an item is pushed out by an observable sequence.
 This can help you troubleshoot time-based operations to ensure accuracy.
 */
console.log('Current time: ' + Date.now());
var source = Rx.Observable.timer(5000, 1000)
  .timestamp()
  .subscribe(x => console.log(x.value + ': ' + x.timestamp));
/* Output will look similar to this */
// => Current time: 1382646947400
// => 0: 1382646952400
// => 1: 1382646953400
// => 2: 1382646954400
// => 3: 1382646955400
// => 4: 1382646956400
// => 5: 1382646957400
// => 6: 1382646958400