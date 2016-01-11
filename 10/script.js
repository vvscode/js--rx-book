// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/implementing_your_own_operators.html
// Creating New Operators

function createMessage(actual, expected) {
  return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

// Using QUnit testing for assertions
var collectionAssert = {
  assertEqual: (expected, actual) => {
    var comparer = Rx.internals.isEqual,
      isOk = true;

    if (expected.length !== actual.length) {
      ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
      return;
    }

    for(var i = 0, len = expected.length; i < len; i++) {
      isOk = comparer(expected[i], actual[i]);
      if (!isOk) {
        break;
      }
    }

    ok(isOk, createMessage(expected, actual));
  }
};

Rx.Observable.prototype.whereProperties = function(properties) {
  var source = this, comparer = Rx.internals.isEqual;

  return Rx.Observable.filterByProperties((observer) => {
    // Our disposable is the subscription from the parent
    return source.subscribe(
      (data) => {
        try {
          var shouldRun = true;
          // Iterate the properties for deep equality
          for (var prop in properties) {
            if (!comparer(properties[prop], data[prop])) {
              shouldRun = false;
              break;
            }
          }
        } catch (e) {
          observer.onError(e);
        }

        if (shouldRun) {
          observer.onNext(data);
        }
      },
      observer.onError.bind(observer),
      observer.onCompleted.bind(observer)
    );
  });
};

Rx.Observable.prototype.flatMap = function(selector){ return this.map(selector).mergeObservable(); };

Rx.Observable.prototype.filterByProperties = function(properties) {
  var comparer = Rx.internals.isEqual;

  return this.filter(data => {

    // Iterate the properties for deep equality
    for (var prop in properties) {
      if (!comparer(properties[prop], data[prop])) {
        return false;
      }
    }

    return true;
  });
};


var onNext = Rx.ReactiveTest.onNext,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('filterProperties should yield with match', () => {

  var scheduler = new Rx.TestScheduler();

  var input = scheduler.createHotObservable(
    onNext(210, { 'name': 'curly', 'age': 30, 'quotes': ['Oh, a wise guy, eh?', 'Poifect!'] }),
    onNext(220, { 'name': 'moe', 'age': 40, 'quotes': ['Spread out!', 'You knucklehead!'] }),
    onCompleted(230)
  );

  var results = scheduler.startWithCreate(
    () => input.filterByProperties({ 'age': 40 })
  );

  collectionAssert.assertEqual(results.messages, [
    onNext(220, { 'name': 'moe', 'age': 40, 'quotes': ['Spread out!', 'You knucklehead!'] }),
    onCompleted(230)
  ]);

  collectionAssert.assertEqual(input.subscriptions, [
    subscribe(200, 230)
  ]);
});