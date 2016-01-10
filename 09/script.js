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