// http://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/bridging_to_events.html

var result = document.getElementById('result');

// document.addEventListener('mousemove', e => result.innerHTML = e.clientX + ', ' + e.clientY, false);

var source = Rx.Observable.fromEvent(result, 'mousemove');
var subscription = source.subscribe(e => result.innerHTML = `${e.clientX}, ${e.clientY}`);

var result2 = document.getElementById('result2');
var sources = document.querySelectorAll('div');
var source2 = Rx.Observable.fromEvent(sources, 'click');
var subscription2 = source2.subscribe(e => result2.innerHTML = `${e.clientX}, ${e.clientY}`);


// fromEvent also supports libraries such as jQuery, Zepto.js, AngularJS, Ember.js and Backbone.js:
var $result3 = $('#result3');
var $sources = $('div');
var source3 = Rx.Observable.fromEvent($sources, 'click');
var subscription3 = source3.subscribe(e => $result3.html(`${e.clientX}, ${e.clientY}`));


//  you could easily add many shortcuts into the event system for events such as mousemove, and even extending to Pointer and Touch Events.
Rx.dom = {};
var root = window; // https://github.com/cycle23/cycle23.github.io/blob/de4be8af4824f02f3e9223dcee3f1214498fefd8/worzone/rx.dom.lite.js#L11

var events = "blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error contextmenu";

if (root.PointerEvent) {
  events += " pointerdown pointerup pointermove pointerover pointerout pointerenter pointerleave";
}

if (root.TouchEvent) {
  events += " touchstart touchend touchmove touchcancel";
}

events.split(' ').forEach(e => {
  Rx.dom[e] = (element, selector) => Rx.Observable.fromEvent(element, e, selector)
});

var getLocation = function(mouseEvent) {
  return { x: mouseEvent.pageX, y: mouseEvent.pageY };
};
var getDelta = function(startPosition, mouseEvent) {
  return {
    x: startPosition.x - mouseEvent.pageX,
    y: startPosition.y - mouseEvent.pageY
  };
};

var draggable = document.getElementById('draggable');
var mousedrag = Rx.dom.mousedown(draggable).flatMap(md => {
  md.preventDefault(); // this line prevent dragging
  var start = getLocation(md);
  return Rx.dom.mousemove(document)
    .map(mm => getDelta(start, mm))
    .takeUntil(Rx.dom.mouseup(draggable));
});
var subscription4 = mousedrag.subscribe(e => draggable.innerHTML = `${e.x}, ${e.y}`);


// There may be instances dealing with libraries which have different ways of subscribing and unsubscribing from events.
// The fromEventPattern method was created exactly for this purpose to allow you to bridge to each of these custom event emitters.
var $tbody = $('#dataTable tbody');

var source5 = Rx.Observable.fromEventPattern(
  function addHandler (h) { $tbody.on('click', 'tr', h); },
  function delHandler (h) { $tbody.off('click', 'tr', h); });

var subscription5 = source5.subscribe(e => alert($( this ).text()));