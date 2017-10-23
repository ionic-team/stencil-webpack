module.exports = class {
  constructor(size) {
    this.size = size;
  }

  isDirectory() {
    return false;
  }

  isFile() {
    return true;
  }
};
