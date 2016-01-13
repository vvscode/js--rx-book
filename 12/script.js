// http://xgrommx.github.io/rx-book/content/how_do_i/jquery_with_rxjs.html

// Animation
$("#go").clickAsObservable().flatMap(() => {
    return $("#block").animateAsObservable({
        width: "70%",
        opacity: 0.4,
        marginLeft: "0.6in",
        fontSize: "3em",
        borderWidth: "10px"
    }, 1500);
}).subscribe();

// Events
Rx.Observable.fromEvent(
    $(document),
    'mousemove').subscribe(e => $('#results').text(`fromEvent: ${e.clientX}, ${e.clientY}`));


// Events with plugin
/**
 * Creates an observable sequence by adding an event listener to the matching jQuery element
 *
 * @param {String} eventName The event name to attach the observable sequence.
 * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
 * @returns {Observable} An observable sequence of events from the specified element and the specified event.
 */
jQuery.fn.toObservable = function (eventName, selector) {
    return Rx.Observable.fromEvent(this, eventName, selector);
};
$(document).toObservable('mousemove')
    .subscribe(e => $('#results2').text(`fromPlugin: ${e.clientX}, ${e.clientY}`));

// AJAX
function searchWikipedia (term) {
    var promise = $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'opensearch',
            format: 'json',
            search: encodeURI(term)
        }
    }).promise();
    return Rx.Observable.fromPromise(promise);
}

$('#input').toObservable('keyup')
    .map(e => e.target.value)
    .flatMapLatest(searchWikipedia)
        .subscribe(data => {
            var results = data[1];
            var list = results.map((result) => `<li>${result}</li>`);
            $('#input-results').html(list.join('\n'));
        });