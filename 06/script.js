// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/error_handling.html

/*
 Using the class level catch method, we can catch errors as they happen with the current sequence
 and then move to the next sequence should there be an error.
 For example, we could try getting data from several URLs,
 it doesn't matter which since they all have the same data,
 and then if that fails, default to a cached version, so an error should never propagate.
 */
Rx.Observable
  .catch(
    get('url1'),
    get('url2'),
    get('url3'),
    getCachedVersion()
  )
  .subscribe(data => {
    // Display the data as it comes in
  });

get('url1').catch(e => {
    if (e.status === 500) {
      return cachedVersion();
    } else {
      return get('url2');
    }
  })
  .subscribe(data => {
    // Display the data as it comes in
  });

Rx.Observable
  .onErrorResumeNext(
    Rx.Observable.just(42),
    Rx.Observable.throw(new Error()),
    Rx.Observable.just(56),
    Rx.Observable.throw(new Error()),
    Rx.Observable.just(78)
  )
  .subscribe(data => console.log(data));


// Ignore errors
/*
 There are some instances with stream processing that you simply want to skip a stream which produces an error
 and move to the next stream. We can achieve this with a class based and instance based onErrorResumeNext method.
 The class based onErrorResumeNext continues a stream that is terminated normally or by an Error with the next stream or Promise.
 Unlike catch, onErrorResumeNext will continue to the next sequence regardless of whether the previous was in error or not.
 */
Rx.Observable
  .onErrorResumeNext(
    Rx.Observable.just(42),
    Rx.Observable.throw(new Error()),
    Rx.Observable.just(56),
    Rx.Observable.throw(new Error()),
    Rx.Observable.just(78)
  )
  .subscribe(console.log.bind(console));


// Retrying Sequences
/*
 With the retry operator, we can try a certain operation a number of times before an error is thrown
 */
get('url')
  .retry(3)
  .subscribe(
    data => console.log(data),
    err => console.log(err)
  );

/*
 In the above example, it will give up after three tries and thus call onError if it continues to fail after the third try.
 We can remedy that by adding catch to use an alternate source.
 */
get('url')
  .retry(3)
  .catch(cachedVersion())
  .subscribe(
    data => {
      // Displays the data from the URL or cached data
      console.log(data);
    }
  );

/*
 We have the retryWhen operator which allows us to deeply control when the next try happens.
 */
get('url')
  .retryWhen(
    (attempts) =>
      attempts
        .zip(Observable.range(1, 3), (_, i) => i)
        .flatMap(i => {
          console.log('delay retry by ' + i + ' second(s)');
          return Rx.Observable.timer(i * 1000);
        })
  )
  .subscribe(
    data => {
      // Displays the data from the URL or cached data
      console.log(data);
    }
  );
// => delay retry by 1 second(s)
// => delay retry by 2 second(s)
// => Data


// Ensuring Cleanup with Finally
var socket = new WebSocket('ws://someurl', 'xmpp');

Rx.Observable.from(data)
  .finally(() => socket.close())
  .subscribe(
    data => {
      socket.send(data);
    }
  );


// Ensuring Resource Disposal
function DisposableWebSocket(url, protocol) {
  var socket = new WebSocket(url, protocol);
  // Create a way to close the WebSocket upon completion
  var d = Rx.Disposable.create(() => socket.close());
  d.socket = socket;
  return d;
}

/*
 There is a cleaner approach we can take by creating a disposable wrapper around our object with a dispose method
 so that when our scope is complete, then the resource is automatically disposed through the using operator.
 */
Rx.Observable
  .using(
    () => new DisposableWebSocket('ws://someurl', 'xmpp'),
    (d) =>
      Rx.Observable.from(data)
        .tap(data => d.socket.send(data))
  )
  .subscribe();


// Delaying Errors with mergeDelayError
var source1 = Rx.Observable.of(1,2,3);
var source2 = Rx.Observable.throwError(new Error('woops'));
var source3 = Rx.Observable.of(4,5,6);

Rx.Observable
  .mergeDelayError(source1, source2, source3)
  .subscribe(
    x => console.log('onNext: %s', x),
    e => console.log('onError: %s', e),
    () => console.log('onCompleted')
  );
// => 1
// => 2
// => 3
// => 4
// => 5
// => 6
// => Error: Error: woops
