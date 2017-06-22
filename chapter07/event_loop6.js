const events = require('events');
const util = require('util');

function AsyncEmitter() {
  process.nextTick(() => {
    this.emit('bar');
  });
}

util.inherits(AsyncEmitter, events.EventEmitter);

const foo = new AsyncEmitter();

foo.on('bar', () => {
  console.log('bar event emitted');
});