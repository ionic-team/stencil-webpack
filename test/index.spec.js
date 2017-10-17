'use strict';

const expect = require('chai').expect;
const mockCompiler = require('./mockCompiler');
const mockFs = require('./mockFs');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('plugin', () => {
  let compilation;
  let mockCallback;
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
    mockGlob = sinon.stub();
    Plugin = proxyquire('../dist/index', {
      glob: mockGlob,
      fs: mockFs
    }).StencilPlugin;
  });

  afterEach(() => {
    mockGlob.reset();
    mockFs.stat.reset();
    mockFs.readFile.reset();
  });

  it('handles the emit', () => {
    const plugin = new Plugin();
    plugin.apply(mockCompiler);
    expect(mockCompiler.plugin.calledOnce).to.be.true;
    expect(mockCompiler.plugin.calledWith('emit')).to.be.true;
  });

  describe('options', () => {
    it('globs a single string properly (currently just the default globbing)', () => {
      const plugin = new Plugin();
      plugin.apply(mockCompiler);
      mockCompiler.plugin.yield(compilation, mockCallback);
      expect(mockGlob.calledOnce).to.be.true;
      expect(
        mockGlob.calledWith(
          '/Users/test/node_modules/test-components/testcomponents/**/*'
        )
      ).to.be.true;
    });

    it('globs a list of paths', () => {
      // WIP
    });
  });

  describe('globbed files', () => {
    let plugin;
    beforeEach(() => {
      plugin = new Plugin();
      plugin.apply(mockCompiler);

      mockGlob.onCall(0).yields(null, ['file1', 'file2', 'file3.14159']);
      mockFs.stat.onCall(0).yields(null, {size: 42});
      mockFs.stat.onCall(1).yields(null, {size: 73});
      mockFs.stat.onCall(2).yields(null, {size: 1138});
      mockFs.readFile.onCall(0).yields(null, 'contents 1');
      mockFs.readFile.onCall(1).yields(null, 'contents 2');
      mockFs.readFile.onCall(2).yields(null, 'pi');
    });

    it('gets the stats on each file', () => {
      mockCompiler.plugin.yield(compilation, mockCallback);
      expect(mockFs.stat.calledThrice).to.be.true;
      expect(mockFs.stat.calledWith('file1')).to.be.true;
      expect(mockFs.stat.calledWith('file2')).to.be.true;
      expect(mockFs.stat.calledWith('file3.14159')).to.be.true;
    });

    it('reads the contents of each file', (done) => {
      mockCompiler.plugin.yield(compilation, () => {
        expect(mockFs.readFile.calledThrice).to.be.true;
        expect(mockFs.readFile.calledWith('file1')).to.be.true;
        expect(mockFs.readFile.calledWith('file2')).to.be.true;
        expect(mockFs.readFile.calledWith('file3.14159')).to.be.true;
        done();
      });
    });

    it('adds the size and contents to the compilatiom assets', function(done) {
      mockCompiler.plugin.yield(compilation, () => {
        expect(compilation.assets['build/testcomponents/file1'].size()).to.equal(42);
        expect(compilation.assets['build/testcomponents/file1'].source()).to.equal('contents 1');
        expect(compilation.assets['build/testcomponents/file2'].size()).to.equal(73);
        expect(compilation.assets['build/testcomponents/file2'].source()).to.equal('contents 2');
        expect(compilation.assets['build/testcomponents/file3.14159'].size()).to.equal(1138);
        expect(compilation.assets['build/testcomponents/file3.14159'].source()).to.equal('pi');
        done();
      });
    });
  });
});
