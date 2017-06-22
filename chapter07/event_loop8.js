const events = require('events');
const util = require('util');

function AsyncCB(cb) {
  if (cb) {
    process.nextTick(() => {
      cb();
    });
  }
}

util.inherits(AsyncCB, events.EventEmitter);
// thisがオブジェクトを指すように、通常のfunction構文を使う
AsyncCB.prototype.setbaz = function(arg) {
  this.baz = arg;
};

const foo = new AsyncCB(() => {
  foo.setbaz('bar');
  console.log(foo.baz);
});