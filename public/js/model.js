(function () {

  var root = window;

  var SORTED_BY_NAME = 'name';

  var File = function (attrs) {
    this.attributes = attrs || {};
  };

  File.prototype.toJSON = function () {
    var object = {
      name: this.attributes.name,
      size: this.attributes.size,
      lastModifiedDate: this.attributes.lastModifiedDate
    };
    return object;
  };

  /**
   * Not equals, just check that files are the similar
   * @returns {boolean}
   */
  File.equals = function (fObj, sObj) {
    return (JSON.stringify(fObj) === JSON.stringify(sObj));
  };

  /**
   *
   * @param files
   * @constructor
   */
  var FileCollection = function () {
    var files = arguments[0];
    this.files = [];
    if (Array.isArray(files) && files.length > 0) {
      files.forEach(function (elem) {
        var file = new File(elem);
        file.collection = this;
        this.files.push(file);
      }, this);
    }
    this.sorted = SORTED_BY_NAME;
    this._selfSort();
  };

  FileCollection.prototype._addFile = function (object) {
    var file = new File(object);
    file.collection = this;
    this.files.push(file);
    this._selfSort();
  };

  FileCollection.prototype._selfSort = function(){
    this.files.sort(this.dynamicSort(this.sorted));
  };

  /**
   * Add file into collection
   * @param file
   * @returns {boolean} return false if collection contains the same object
   */
  FileCollection.prototype.addFile = function (file) {
    if (!this.contains(file)) {
      this._addFile(file);
      return true;
    } else {
      return false;
    }
  };

  /**
   * Check is collection contains the same object
   * @param file
   * @returns {*}
   */
  FileCollection.prototype.contains = function (file) {
    return this.files.some(function (elem) {
      return File.equals(file, elem);
    });
  };

  FileCollection.prototype.sort = function (property) {

    var sortBy = property;
    if (this.sorted === property) {
      sortBy = '-' + property;
      this.files.sort(this.dynamicSort(sortBy));
    } else {
      this.files.sort(this.dynamicSort(sortBy));
    }
    this.sorted = sortBy;
  };

  FileCollection.prototype.dynamicSort = function (property) {
    var sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var f = a.attributes[property],
        s = b.attributes[property];
      var result = (f < s) ? -1 : (f > s) ? 1 : 0;
      return result * sortOrder;
    };
  };


  /**
   * Serialize collection
   * @returns {*}
   */
  FileCollection.prototype.serialize = function (){
    return this.files.map(function (file) {
      return file.toJSON();
    });
  };

  root.MyM = {};

  root.MyM.File = File;
  root.MyM.FileCollection = FileCollection;
})();