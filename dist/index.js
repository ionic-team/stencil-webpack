'use strict';

const glob = require('glob');
const fs = require('fs');
const path = require('path');

module.exports = {
  StencilPlugin: StencilPlugin
};

function StencilPlugin(src) {
  this.sources = (typeof src === 'string' ? [src] : src);
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

function process(file, dest, compilation) {
  return new Promise((resolve) => {
    (async () => {
      const outfile = path.join(dest, path.basename(file));
      const info = await fileStat(file);
      const contents = await read(file);
      compilation.assets[outfile] = {
        size: function() {
          return info.size;
        },
        source: function() {
          return contents;
        }
      };
      resolve();
    })();
  });
}

function getDestinationPath(src) {
  const parts = src.split('/');
  return path.join('build', parts[parts.length - 1]);
}

StencilPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    const writes = [];
    this.sources.forEach((src) => {
      const srcPath = path.join(compilation.options.context, src, '**/*');
      const destPath = getDestinationPath(src);
      glob(srcPath, (err, files) => {
        if (files) {
          files.forEach((file) => {
            writes.push(process(file, destPath, compilation));
          });
        }
        Promise.all(writes).then(() => {
          callback();
        });
      });
    });
  });
};
