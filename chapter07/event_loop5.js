const events = require('events');
const util = require('util');
function SyncEmitter() {
  this.emit('bar');
}

util.inherits(SyncEmitter, events.EventEmitter);
const foo = new SyncEmitter();

foo.on('bar', () => {
  console.log('bar event emitted');
});