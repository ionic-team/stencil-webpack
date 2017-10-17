var sinon = require('sinon');

let mockFs = sinon.stub({
  readFile: function() {},
  stat: function() {}
});

module.exports = mockFs;
