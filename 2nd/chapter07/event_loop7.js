const events = require('events');
const util = require('util');

function SyncCB(cb) {
  if (cb) cb();
}

util.inherits(SyncCB, events.EventEmitter);
SyncCB.prototype.setbaz = function(arg) {
  this.baz = arg;
};

const foo = new SyncCB(function() {
  foo.setbaz('bar');
  console.log(foo.baz);
});