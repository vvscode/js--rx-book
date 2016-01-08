// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/backpressure.html

// Debounce
/*
 The first technique for lossy backpressure is called debounce which only emits an item from the source
  Observable after a particular timespan has passed without the Observable emitting any other items.
  This is useful in scenarios such as if the user is typing too fast and you do not want to yield every keystroke,
   and instead wait half a second after the person stopped typing before yielding the value.
 */

Rx.Observable.fromEvent(input, 'keyup')
  .map(e => e.target.value)
  .debounce(500 /* ms */)
  .subscribeOnNext(value => console.log('Input value: %s', value));

// Throttling
/*
 Another technique to deal with an observable sequence which is producing too much for the consumer is through throttling
 with the use of the throttleFirst method which emits the first items emitted by an Observable within periodic time intervals.
  Throttling can be especially useful for rate limiting execution of handlers on events like resize and scroll.
 */

Rx.Observable.fromEvent(window, 'resize')
  .throttleFirst(250 /* ms */)
  .subscribeOnNext(e => {
   console.log('Window inner height: %d', window.innerHeight);
   console.log('Window inner width: %d', window.innerWidth);
 });

// Sampling Observables
/*
 You can also at certain intervals extract values from the observable sequence using the sample method.
 This is useful if you want values from say a stock ticker every five seconds
 or so without having to consume the entire observable sequence.
 */

getStockData()
  .sample(5000 /* ms */)
  .subscribeOnNext(data => console.log('Stock data: %o', data));

// Pausable Observables
var pausable = getSomeObservableSource()
  .pausable();
pausable.subscribeOnNext(data => console.log('Data: %o', data));
pausable.pause();
// Resume in five seconds
setTimeout(() => pausable.resume(), 5000);

// Buffers and Windows
/*
 The bufferWithCount method allows us to specify the number of items that you wish to capture in a buffer array before yielding it to the consumer.
 An impractical yet fun use of this is to calculate whether the user has input the Konami Code for example.
 */
var codes = [
  38, // up
  38, // up
  40, // down
  40, // down
  37, // left
  39, // right
  37, // left
  39, // right
  66, // b
  65  // a
];
function isKonamiCode(buffer) {
  return codes.toString() === buffer.toString();
}
var keys = Rx.Observable.fromEvent(document, 'keyup')
  .map(e => e.keyCode)
  .bufferWithCount(10, 1)
  .filter(isKonamiCode)
  .subscribeOnNext(() => console.log('KONAMI!'));

/*
 On the other hand, you can also get the data within a buffer for a given amount of time with the bufferWithTime.
 This is useful for example if you are tracking volume of data that is coming across the network, which can then be handled uniformly.
 */
getStockData()
  .bufferWithTime(5000, 1000) // time in milliseconds
  .subscribeOnNext(data => data.forEach(d => console.log('Stock: %o', d)));

/*
 In order to keep buffers from filling too quickly, there is a method to cap the buffer by specifying ceilings for count and timespan,
 whichever occurs first. For example, the network could be particularly quick with the data for the specified time,
  and other times not, so to keep the data levels even, you can specify this threshold via the bufferWithTimeOrCount method
 */
getStockData()
  .bufferWithTimeOrCount(5000 /* ms */, 100 /* items */)
  .subscribeOnNext(data => data.forEach(d => console.log('Stock: %o', d)));

// Pausable Buffers
/*
 we have introduced the pausableBuffered method which keeps a running buffer between pause is called and is drained when resume is called.
 */
var source = getStockData()
  .pausableBuffered();
source.subscribeOnNext(stock => console.log('Stock data: %o', stock));
source.pause();
// Resume after five seconds
setTimeout(() => {
  // Drains the buffer and subscribeOnNext is called with the data
  source.resume();
}, 5000);

// Controlled Observables
/*
 In more advanced scenarios, you may want to control the absolute number of items that you receive at a given time,
 and the rest is buffered via the controlled method. For example, you can pull 10 items, followed by 20 items,
 and is up to the discretion of the developer
 */
var source = getStockData()
  .controlled();
source.subscribeOnNext(stock => console.log('Stock data: %o', stock));
source.request(2);
// Keep getting more after 5 seconds
setInterval(() => source.request(2), 5000);







