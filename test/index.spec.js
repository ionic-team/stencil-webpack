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
    sinon.spy(mockCompiler, 'plugin');
    plugin.apply(mockCompiler);
    expect(mockCompiler.plugin.calledOnce).to.be.true;
    expect(mockCompiler.plugin.calledWith('emit')).to.be.true;
  });

  describe('options', () => {
    beforeEach(() => {
      sinon.stub(mockCompiler, 'plugin');
    });

    it('throws an error if no configuration object is given', () => {
      expect(() => { new Plugin(); }).to.throw(
        Error, 'No configuration object has been specified.'
      );
    });

    it('throws an error if the configurtion object has no collections property', () => {
      expect(() => { new Plugin({}); }).to.throw(
        Error, 'Must specify component collections.'
      );
      expect(() => { new Plugin({collections: null}); }).to.throw(
        Error, 'Must specify component collections.'
      );
      expect(() => { new Plugin({collections: []}); }).to.throw(
        Error, 'Must specify component collections.'
      );
    });


    it('globs a single string property', () => {
      const plugin = new Plugin({
        collections: [
          'node_modules/brush-components/brushcomponents'
        ]
      });
      plugin.apply(mockCompiler);
      mockCompiler.plugin.yield(compilation, mockCallback);
      expect(mockGlob.calledOnce).to.be.true;
      expect(
        mockGlob.calledWith(
          '/Users/test/node_modules/brush-components/brushcomponents/**/*'
        )
      ).to.be.true;
    });

    it('globs a list of paths', () => {
      const plugin = new Plugin({
        collections: [
          'node_modules/brush-components/brushcomponents',
          'node_modules/tool-components/toolcomponents',
          'node_modules/page-components/pagecomponents',
          'node_modules/web-components/webcomponents',
        ]
      });
      plugin.apply(mockCompiler);
      mockCompiler.plugin.yield(compilation, mockCallback);
      expect(mockGlob.callCount).to.equal(4);
      expect(
        mockGlob.calledWith(
          '/Users/test/node_modules/brush-components/brushcomponents/**/*'
        )
      ).to.be.true;
      expect(
        mockGlob.calledWith(
          '/Users/test/node_modules/tool-components/toolcomponents/**/*'
        )
      ).to.be.true;
      expect(
        mockGlob.calledWith(
          '/Users/test/node_modules/page-components/pagecomponents/**/*'
        )
      ).to.be.true;
      expect(
        mockGlob.calledWith(
          '/Users/test/node_modules/web-components/webcomponents/**/*'
        )
      ).to.be.true;
    });

    it('fixes windows style paths', () => {
      const plugin = new Plugin({
        collections: [
          'node_modules\\brush-components\\brushcomponents'
        ]
      });
      plugin.apply(mockCompiler);
      mockCompiler.plugin.yield(compilation, mockCallback);
      expect(mockGlob.calledOnce).to.be.true;
      expect(
        mockGlob.calledWith(
          '/Users/test/node_modules/brush-components/brushcomponents/**/*'
        )
      ).to.be.true;

    });
  });

  describe('globbed files', () => {
    let plugin;
    beforeEach(() => {
      plugin = new Plugin({
        collections: 'node_modules/ford-prefect/fordprefect'
      });
      sinon.stub(mockCompiler, 'plugin');
      plugin.apply(mockCompiler);

      sinon.stub(mockFs, 'readFile');
      sinon.stub(mockFs, 'stat');

      mockGlob.onCall(0).yields(null, ['file1', 'file2', 'file3.14159']);
      mockFs.stat.onCall(0).yields(null, new MockStat(42));
      mockFs.stat.onCall(1).yields(null, new MockStat(73));
      mockFs.stat.onCall(2).yields(null, new MockStat(1138));
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
        expect(compilation.assets['build/fordprefect/file1'].size()).to.equal(42);
        expect(compilation.assets['build/fordprefect/file1'].source()).to.equal('contents 1');
        expect(compilation.assets['build/fordprefect/file2'].size()).to.equal(73);
        expect(compilation.assets['build/fordprefect/file2'].source()).to.equal('contents 2');
        expect(compilation.assets['build/fordprefect/file3.14159'].size()).to.equal(1138);
        expect(compilation.assets['build/fordprefect/file3.14159'].source()).to.equal('pi');
        done();
      });
    });
  });
});
