import * as path from 'path';


class StencilPlugin {
  private fs: FS;
  private outputBase: string;

  constructor(options: PluginOptions = {}) {
    this.outputBase = options.outputBase || ""
  }

  apply(compiler: any) {
    compiler.plugin('emit', (compilation: Complication, callback: Function) => {
      this.fs = compiler.inputFileSystem;
      this.inspectModules(compilation.assets, compilation.modules).then(() => {
        callback();

      }).catch(err => {
        console.log('Webpack StencilPlugin Error:', err);
        callback();
      });
    });
  }

  inspectModules(assets: Assets, modules: ComplicationModule[]): Promise<any> {
    if (!assets || !Array.isArray(modules)) {
      return Promise.resolve();
    }

    return Promise.all(modules.map(m => {
      return this.addAppAssets(assets, m.resource);
    }));
  }

  async addAppAssets(assets: Assets, filePath: string) {
    if (typeof filePath !== 'string') {
      return Promise.resolve();
    }

    const appNamespace = path.basename(filePath, '.js');
    const appAssetsDir = path.join(path.dirname(filePath), appNamespace);

    // try to get a list of files in a sibling directory to this module file
    // an app will have a sibling directory with the same name as the filename
    // the readdir will not error at always return string[]
    const dirItems = await this.readdir(appAssetsDir);

    // app directory will have a core file that starts with the app namespace
    const hasAppCore = dirItems.some(f => f.startsWith(appNamespace));
    if (!hasAppCore) {
      return Promise.resolve();
    }

    return this.addAppDirectory(assets, appNamespace, appAssetsDir, appAssetsDir);
  }

  async addAppDirectory(assets: Assets, appNamespace: string, appAssetsDir: string, dir: string) {
    const dirItems = await this.readdir(dir);

    return Promise.all(dirItems.map(dirItem => {
      const filePath = path.join(dir, dirItem);
      return this.addAppAsset(assets, appNamespace, appAssetsDir, filePath);
    }));
  }

  async addAppAsset(assets: Assets, appNamespace: string, appAssetsDir: string, filePath: string): Promise<any> {
    const stats = await this.readStat(filePath);

    if (stats.isDirectory()) {
      return this.addAppDirectory(assets, appNamespace, appAssetsDir, filePath);
    }

    const data = await this.readFile(filePath);

    const assetPath = normalizePath(path.join(this.outputBase, appNamespace, path.relative(appAssetsDir, filePath)));

    assets[assetPath] = {
      source: () => data,
      size: () => stats.size
    };

    return Promise.resolve();
  }

  readdir(dir: string): Promise<string[]> {
    return new Promise(resolve => {
      this.fs.readdir(dir, (err, files) => {
        if (err) {
          resolve([]);
        } else {
          resolve(files);
        }
      });
    });
  }

  readFile(filePath: string): Promise<any> {
    return new Promise(resolve => {
      this.fs.readFile(filePath, (err, data) => {
        if (err) {
          resolve([]);
        } else {
          resolve(data);
        }
      });
    });
  }

  readStat(filePath: string): Promise<FsStats> {
    return new Promise((resolve, reject) => {
      this.fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(err);
          reject();
        } else {
          resolve(stats);
        }
      });
    });
  }

}

function normalizePath(str: string) {
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


module.exports = {
  StencilPlugin: StencilPlugin
};


interface Complication {
  assets: Assets;
  modules: ComplicationModule[];
}

interface Assets {
  [filePath: string]: Asset;
}

interface Asset {
  source(): any;
  size(): number;
}

interface ComplicationModule {
  resource: string;
}

interface FS {
  access(path: string, callback: (err: any) => void): void;
  readdir(path: string, callback?: (err: any, files: string[]) => void): void;
  readFile(filename: string, callback: (err: any, data: any) => void): void;
  stat(path: string, callback?: (err: any, stats: FsStats) => any): void;
}

interface FsStats {
  isFile(): boolean;
  isDirectory(): boolean;
  size: number;
}

interface PluginOptions {
  outputBase?: string
}