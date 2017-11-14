'use strict';

const glob = require('glob');
const fs = require('fs');
const path = require('path');

module.exports = {
  StencilPlugin: StencilPlugin
};

function StencilPlugin(config) {
  if (!config) {
    throw new Error('No configuration object has been specified.');
  }
  if (!config.collections || config.collections.length === 0) {
    throw new Error('Must specify component collections.');
  }

  this.sources = typeof config.collections === 'string' ? [config.collections] : config.collections;
}

function fileStat(file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, contents) => {
      if (err) {
        reject(err);
      } else {
        resolve(contents);
      }
    });
  });
}

function processDirectory(compilation, src) {
  const writes = [];
  const srcPath = normalizePath(path.join(compilation.options.context, src));
  const srcGlob = normalizePath(path.join(srcPath, '**/*'));
  const destPath = normalizePath(getDestinationPath(src));
  glob(srcGlob, (err, files) => {
    if (files) {
      files.forEach(file => {
        const outfile = normalizePath(path.join(destPath, file.replace(srcPath, '')));
        writes.push(process(file, outfile, compilation));
      });
    }
  });
  return writes;
}

function process(file, outfile, compilation) {
  return new Promise(resolve => {
    (async () => {
      const info = await fileStat(file);
      if (info.isFile()) {
        const contents = await read(file);
        compilation.assets[outfile] = {
          size: function() {
            return info.size;
          },
          source: function() {
            return contents;
          }
        };
      }
      resolve();
    })();
  });
}

function getDestinationPath(src) {
  const parts = src.split('/');
  return path.join('build', parts[parts.length - 1]);
}

function normalizePath(str) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus
  const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
  const NON_ASCII_REGEX = /[^\x00-\x80]+/;
  const SLASH_REGEX = /\\/g;

  if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
    return str;
  }

  return str.replace(SLASH_REGEX, '/');
}

StencilPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    let writes = [];
    this.sources.forEach(src => {
      writes = writes.concat(processDirectory(compilation, src));
    });
    Promise.all(writes).then(() => {
      callback();
    });
  });
};
