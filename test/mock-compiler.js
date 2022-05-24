module.exports = function() {
  return {
    hooks: {
      emit: {
        tapAsync: () => {}
      }
    }
  }
}
