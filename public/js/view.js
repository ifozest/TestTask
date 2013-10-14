(function () {

  var FileView = function (file) {
    this.file = file;
    this._createImage();
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

    tr.addEventListener('dragstart', this._dragStart.bind(this), false);
    this.el = tr;

    return this;
  };

  FileView.prototype._dragStart = function (e) {

    this._handleDragLeaveEvent();
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify(this.file));
    e.dataTransfer.setDragImage(this.image, 10, 10);
  };

  /**
   * Handle drag leave event out of widget
   * Workaround
   * @private
   */
  FileView.prototype._handleDragLeaveEvent = function () {
    var self = this,
      hover = this.file.collection.widget.hover;

    var dragLeaveListener = function (e) {
      e.preventDefault();
      e.stopPropagation();
      self.removeFileFromWidget();
      self.removeView();
      hover.removeEventListener('dragleave', dragLeaveListener, false);
    };
    hover.addEventListener('dragleave', dragLeaveListener, false);

    hover.addEventListener('drop', function () {
      hover.removeEventListener('dragleave', dragLeaveListener, false);
    }, false);
  };

  /**
   * Remove element from collection and from view
   */
  FileView.prototype.removeFileFromWidget = function () {
    var files = this.file.collection.files,
      index = files.indexOf(this.file);
    files.splice(index, 1);
  };

  /**
   * Remove file view from page
   */
  FileView.prototype.removeView = function () {
    var el = this.el;
    el.parentNode.removeChild(el);
  };

  /**
   * Image that shows on drag event
   * @private
   */
  FileView.prototype._createImage = function() {
    var dragIcon = document.createElement('img');
    dragIcon.src = 'img/file.png';
    this.image = dragIcon;
  };

  var root = window;
  root.MyV = {};
  root.MyV.FileView = FileView;
})();