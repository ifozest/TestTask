(function (MyM) {

  var FileView = function (file) {
    this.file = file;
  };

  FileView.prototype.render = function () {
    var attr = this.file.toJSON(),
      tr = document.createElement('tr'),
      nameTd = document.createElement('td'),
      sizeTd = document.createElement('td'),
      dateTd = document.createElement('td');

    tr.className = 'fileView';
    tr.setAttribute('draggable', true);
    nameTd.innerHTML = attr.name;
    sizeTd.innerHTML = attr.size;
    dateTd.innerHTML = attr.lastModifiedDate;

    tr.appendChild(nameTd);
    tr.appendChild(sizeTd);
    tr.appendChild(dateTd);

   tr.addEventListener('dragstart', this.dragStart.bind(this), false);
    this.el = tr;

    return this;
  };

  FileView.prototype.dragStart = function (e) {
    var self = this,
     hover  = this.file.collection.widget.hover;

    var handleDragLeaveEvent = function (e) {
      e.preventDefault();
      e.stopPropagation();
      self.removeAndDestroy();
      this.removeEventListener('dragleave', handleDragLeaveEvent, false);
    };
    hover.addEventListener('dragleave', handleDragLeaveEvent, false);

    var json = this.file.toJSON();
    json.lastModifiedDate = json.lastModifiedDate.getTime();
    e.dataTransfer.setData('text', JSON.stringify(this.file));
  };

  /**
   * Remove element from collection and from view
   */
  FileView.prototype.removeAndDestroy = function () {
    var el = this.el,
      files = this.file.collection.files,
      index = files.indexOf(this.file);
    files.splice(index, 1);
    el.parentNode.removeChild(el);
  };



  var root = window;
  root.MyV = {};
  root.MyV.FileView = FileView;
})(window.MyM);