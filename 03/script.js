var callback = function(param, cb) {
  setTimeout(function() {
    cb('From callback ', param);
  });
};

Rx.Observable.fromCallback(callback)('test param')
  .subscribe(
    x => console.log('onNext:', x),
    e => console.log('onError:', e),
    () => console.log('onCompleted')
  );

var nodeStyleCallback = function(param, cb) {
  setTimeout(function() {
    cb(null, 'From callback ', param); // First param mean error
  });
};

Rx.Observable
  .fromNodeCallback(nodeStyleCallback)('test for node-style cb')
  .subscribe(
    x => console.log('onNext: success!'),
    e => console.log('onError:', e),
    () => console.log('onCompleted')
  );

//--- Converting Observable sequences to Callbacks
Rx.Observable.prototype.toCallback = function(cb) {
  var source = this;
  return () => {
    var val, hasVal = false;
    source.subscribe(
      x=> {
        hasVal = true;
        val = x;
      },
      e => {
        throw e
      }, // Default error handling
      () => hasVal && cb(val)
    );
  };
};

Rx.Observable.prototype.toNodeCallback = function(cb) {
  var source = this;
  return () => {
    var val, hasVal = false;
    source.subscribe(
      x => {
        hasVal = true;
        val = x;
      },
      e => cb(e),
      () => hasVal && cb(null, val)
    );
  };
};

function cb(x) {
  console.log('hi!');
}

setTimeout(
  Rx.Observable.timer(100)
    .toCallback(cb)
  , 0);

//--- Promises
// Create a promise which resolves 42
var promise1 = new Promise((resolve, reject) => resolve(42));
var source1 = Rx.Observable.fromPromise(promise1);

var subscription1 = source1.subscribe(
  x => console.log('onNext:', x),
  e => console.log('onError:', e),
  () => console.log('onCompleted')
);
// => onNext: 42
// => onCompleted

// Create a promise which rejects with an error
var promise2 = new Promise((resolve, reject) => reject(new Error('reason')));

var source2 = Rx.Observable.fromPromise(promise2);

var subscription2 = source2.subscribe(
  x => console.log('onNext:', x),
  e => console.log('onError:', e),
  () => console.log('onCompleted')
);
// => onError: reject

// Return a single value
var source1 = Rx.Observable.just(1).toPromise(Promise);
source1.then(
  value => console.log('Resolved value: %s', value),
  reason => console.log('Rejected reason: %s', reason)
);
// => Resolved value: 1

// Reject the Promise
var source2 = Rx.Observable.throw(new Error('reason')).toPromise(Promise);
source2.then(
  value => console.log('Resolved value: %s', value),
  reason => console.log('Rejected reason: %s', reason)
);

// to change .toPromise output for hole system we can do ( for non ES6 environments )
// Rx.config.Promise = RSVP.Promise;
// var source1 = Rx.Observable.just(1).toPromise(); // RSVP-promise