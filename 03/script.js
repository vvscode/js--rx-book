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
  Rx.Observable.timer(500)
    .toCallback(cb)
  , 500);
