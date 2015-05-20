var CoreObject = require('core-object');
var debug = require('debug')('broccoli-caching-writer');
var EMPTY_ARRAY;

var Key = CoreObject.extend({
  init: function(type, fullPath, path, stat, children) {
    this.type = type;
    this.fullPath = fullPath;
    this.path = path;
    this.stat = stat;
    this.children = children || EMPTY_ARRAY;
  },

  toString: function() {
    return ' type: '       + this.type +
           ' fullPath: '   + this.fullPath +
           ' path: '       + this.path +
           ' stat.mode: '  + this.stat.mode +
           ' stat.size: '  + this.stat.size +
           ' stat.mtime: ' + this.stat.mtime.getTime();
  },

  inspect: function() {
    return [
      this.type,
      this.path,
      this.stat.mode,
      this.stat.size,
      this.stat.size,
      this.stat.mtime.getTime()
    ].join(', ');
  },

  equal: function(otherKey) {
    if (otherKey === undefined) {
      logNotEqual(this, otherKey);
      return false;
    }

    if (this.type === otherKey.type && this.type === 'directory') {
      var children = this.children;
      var otherChildren = otherKey.children;

      if (children.length === otherChildren.length) {
        for (var i = 0; i < children.length; i++) {
          if (children[i].equal(otherChildren[i])) {
            // they are the same
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }

    // key represents a file, diff the file
    if (this.type       === otherKey.type &&
        this.path       === otherKey.path &&
        this.stat.mode  === otherKey.stat.mode &&
        this.stat.size  === otherKey.stat.size &&
        this.type === 'directory' ? true : this.stat.mtime.getTime() === otherKey.stat.mtime.getTime()) {
      return true;
    } else {
      logNotEqual(this, otherKey);
    }
  }
});

function logNotEqual(previous, next) {
  debug(" cache eviction due to: \n     - {%o} \n     - {%o}", previous, next);
}

module.exports = Key;
