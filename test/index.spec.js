'use strict';

const expect = require('chai').expect;
const MockCompiler = require('./mock-compiler');
const MockFs = require('./mock-fs');
const MockStat = require('./mock-stat');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('plugin', () => {
  let compilation;
  let mockCallback;
  let mockCompiler;
  let mockFs;
  let mockGlob;
  let Plugin;

  beforeEach(() => {
    compilation = {
      options: {
        context: '/Users/test'
      },
      assets: {}
    };
    mockCallback = sinon.stub();
    mockCompiler = new MockCompiler();
    mockFs = new MockFs();
    mockGlob = sinon.stub();
    Plugin = proxyquire('../dist/index', {
      glob: mockGlob,
      fs: mockFs
    }).StencilPlugin;
  });

  afterEach(() => {
    mockGlob.reset();
  });

  it('handles the emit', () => {
    const plugin = new Plugin({
      collections: 'node_modules/tool-components/toolcomponents'
    });
    var callback = sinon.spy(mockCompiler.hooks.emit, 'tapAsync');
    plugin.apply(mockCompiler);
    expect(callback.called).to.true
  });
});
