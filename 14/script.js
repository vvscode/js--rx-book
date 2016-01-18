// http://xgrommx.github.io/rx-book/content/how_do_i/simple_event_emitter.html

/*
 The idea is
 var emitter = new Emitter();

 function logData(data) {
 console.log('data: ' + data);
 }

 emitter.on('data', logData);
 emitter.emit('data', 'foo'); // => data: foo
 // Destroy handler
 emitter.off('data', logData);
 */

var subject = new Rx.Subject();
var subscription = subject.subscribe(data => console.log(`Base idea data: ${data}`));
subject.onNext('foo'); // => data: foo

// let's put it to work to handle multiple types of events at once
var hasOwnProp = {}.hasOwnProperty;

function createName(name) {
    return `$ ${name}`;
}

function Emitter() {
    this.subject = {};
}

Emitter.prototype.emit = (name, data) => {
    var fnName = createName(name);
    this.subject[fnName] || (this.subject[fnName] = new Rx.Subject());
    this.subject[fnName].onNext(data);
};

Emitter.prototype.listen = (name, handler) => {
    var fnName = createName(name);
    this.subject[fnName] || (this.subject[fnName] = new Rx.Subject());
    return this.subject[fnName].subscribe(handler);
};

Emitter.prototype.dispose = () => {
    var subject = this.subject;
    for (var prop in subject) {
        if (hasOwnProp.call(subject, prop)) {
            subject[prop].dispose();
        }
    }

    this.subject = {};
};

// Let's test
var emitter = new Emitter();

var subcription1 = emitter.listen('typeOne', data => console.log(`typeOne data: ${data}`));
var subcription2 = emitter.listen('typeTwo', data => console.log(`typeTwo data: ${data}`));

emitter.emit('typeOne', 'foo'); // => typeOne data: foo
emitter.emit('typeTwo', 'bar'); // => typeTwo data: bar
emitter.emit('typeTwo', 'foobar'); // => typeTwo data: foobar

// Destroy the subscription
subcription1.dispose();
subcription2.dispose();