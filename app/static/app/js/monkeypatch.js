Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.flatten = function() {
  return this.reduce(( acc, cur ) => acc.concat(cur), [])
}
