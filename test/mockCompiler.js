var sinon = require('sinon');

let mockCompiler = sinon.stub({
  plugin: function() {}
});

module.exports = mockCompiler;
