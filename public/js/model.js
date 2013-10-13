(function () {

  var root = window;

  var UNSORTED = 0,
    SORTED_BY_NAME_ASC = 1,
    SORTED_BY_SIZE_ASC = 2,
    SORTED_BY_DATE_ASC = 3,
    SORTED_BY_NAME_DESC = -1,
    SORTED_BY_SIZE_DESC = -2,
    SORTED_BY_DATE_DESC = -3;

  var File = function (attrs) {
    this.attributes = attrs || {};
  };

  File.prototype.toJSON = function () {
    var object = {
      name: this.attributes.name,
      size: this.attributes.size,
      lastModifiedDate: this.attributes.lastModifiedDate
    }
    return object;
  };

  File.equals = function (fObj, sObj) {
    return (JSON.stringify(fObj) === JSON.stringify(sObj));
  };


  var FileCollection = function (files) {
    this.files = [];
    if (Array.isArray(files) && files.length > 0) {
      files.forEach(function (elem) {
        var file = new File(elem);
        file.collection = this;
        this.files.push(file);
      }, this);
    }
    this.sorted = UNSORTED;
  };

  FileCollection.prototype._addFile = function (file) {
    var file = new File(file);
    file.collection = this;
    this.files.push(file);
  };

  FileCollection.prototype.addFile = function (file) {
    if (!this.contains(file)) {
      this._addFile(file);
      return true;
    } else {
      return false;
    }
  };

  FileCollection.prototype.contains = function (file) {
    return this.files.some(function (elem) {
      return File.equals(file, elem);
    })
  };

  /**
   *  TODO rewrite this!
   * @param file
   */
  FileCollection.prototype.sortBySize = function () {

    var sorted = this.sorted;
    console.log(this.sorted);
    if (!sorted || sorted !== SORTED_BY_NAME_ASC) {
      console.log(this.files);
      this.files.sort(function (a, b) {
        var fSize = a.attributes.size;
        var sSize = b.attributes.size;
        return fSize - sSize;
      });
      this.sorted = SORTED_BY_NAME_ASC;

    } else if (sorted === SORTED_BY_NAME_ASC) {
      console.log(this.files);
      this.files.reverse();
      this.sorted = SORTED_BY_NAME_DESC;
    }
  };

  root.MyM = {};

  root.MyM.File = File;
  root.MyM.FileCollection = FileCollection;
})();