let count = 0;

module.exports = {
  say: (name) => {
    count++;
    console.log('Hello ' + name);
  },

  getCount: () => {
    return count;
  },

  resetCount: () => {
    count = 0;
  }
};