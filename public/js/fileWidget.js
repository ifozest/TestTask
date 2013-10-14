(function (Models, Views) {

  var SORTED_BY_NAME = 'name',
    SORTED_BY_SIZE = 'size',
    SORTED_BY_DATE = 'lastModifiedDate';

  /**
   * File widget, user can drop files from desktop, from another widget
   * @constructor
   */
  var FileWidget = function () {
    this.fileCollection = new Models.FileCollection(arguments[0]);
    this.fileCollection.widget = this;
  };

  FileWidget.prototype.serialize = function () {
    return this.fileCollection.serialize();
  };

  /**
   * Render
   * @returns {*}
   */
  FileWidget.prototype.render = function () {
    var fragment = document.createDocumentFragment(),
      table = document.createElement('table'),
      hover = document.createElement('div'),
      tbody = document.createElement('tbody');

    hover.className = 'hover';
    table.appendChild(hover);
    this.hover = hover;

    table.appendChild(tbody);
    table.className = 'table table-striped table-hover table-condensed'; // table-bordered
    this._renderHeader(tbody);

    var filesList = this._renderListOfFiles();
    tbody.appendChild(filesList);
    this._renderFooter(tbody);
    fragment.appendChild(table);

    this.hover.addEventListener('drop', this._dropEvent.bind(this), false);
    this.hover.addEventListener('dragleave', this._dragLeave.bind(this), false);
    table.addEventListener('dragover', this._dragOver.bind(this), false);
    this.el = table;
//    this._renderSortMarkers();
    return this;
  };


  FileWidget.prototype._renderHeader = function (tbody) {

    var tr = document.createElement('tr'),
      nameTh = document.createElement('th'),
      sizeTh = document.createElement('th'),
      dateTh = document.createElement('th');

    nameTh.innerHTML = 'Name';
    sizeTh.innerHTML = 'Size';
    dateTh.innerHTML = 'Date Modified';

    nameTh.className = 'name';
    sizeTh.className = 'size';
    dateTh.className = 'lastModifiedDate';

    tr.appendChild(nameTh);
    tr.appendChild(sizeTh);
    tr.appendChild(dateTh);
    nameTh.addEventListener('click', this._sort(SORTED_BY_NAME), false);
    sizeTh.addEventListener('click', this._sort(SORTED_BY_SIZE), false);
    dateTh.addEventListener('click', this._sort(SORTED_BY_DATE), false);
    tbody.appendChild(tr);
  };

  FileWidget.prototype._sort = function (property) {
    return function () {
      var fileCollection = this.fileCollection;
      if (fileCollection.files.length !== 0) {
        fileCollection.sort(property);
        this._reRender();
      }
    }.bind(this);
  };


  FileWidget.prototype._renderFooter = function (tbody) {
    var tr = document.createElement('tr'),
      addNewFooter = document.createElement('td');

    addNewFooter.innerHTML = '+ Add new';
    addNewFooter.setAttribute('colspan', '3');
    tr.className = 'widgetFooter';
    tr.appendChild(addNewFooter);

    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.style.display = 'none';

    tr.addEventListener('click', this._clickFooterEvent.bind(this), false);
    input.addEventListener('change', this._inputFileEvent.bind(this), false);

    tr.appendChild(input);
    tbody.appendChild(tr);
  };

  /**
   * Fires on drop event, add object into collection
   * @param e
   * @private
   */
  FileWidget.prototype._dropEvent = function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.hover.style.display = 'none';
    var dt = e.dataTransfer,
      data = dt.getData('application/json'),
      file;

    if (data) {
      file = JSON.parse(data);
      var date = file.lastModifiedDate;
      file.lastModifiedDate = new Date(date);
    } else {
      file = dt.files[0];
      if (file) {
        file = this._prepareObjectFromDesktop(file);
      }
    }
    if (file) {
      var isAdded = this.fileCollection.addFile(file);
      this._renderResultOfAddFile(isAdded);
    } else {
      alert('error');
    }
  };


  FileWidget.prototype._dragLeave = function () {
    this.hover.style.display = 'none';
  };

  /**
   * Workaround of html dragleave event
   * @param e
   * @private
   */
  FileWidget.prototype._dragOver = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var hover = this.hover,
      el = this.el;
    var rect = el.getBoundingClientRect();
    hover.style.width = rect.width + 'px';
    hover.style.height = rect.height + 'px';
    hover.style.display = 'inline';
  };

  FileWidget.prototype._clickFooterEvent = function () {
    var input = this.el.getElementsByTagName('input')[0];
    input.click();
  };

  FileWidget.prototype._inputFileEvent = function (e) {
    var file = e.target.files[0];
    if (file) {
      file = this._prepareObjectFromDesktop(file);
      var isAdded = this.fileCollection.addFile(file);
      this._renderResultOfAddFile(isAdded);
    }
    this._createAnotherInput();
  };

  /**
   * Another workaround to clear input type:file
   * @private
   */
  FileWidget.prototype._createAnotherInput = function () {
    var i = this.el.getElementsByTagName('input')[0],
      clone = i.cloneNode(true);
    clone.addEventListener('change', this._inputFileEvent.bind(this), false);
    i.parentNode.replaceChild(clone, i);
  };

  FileWidget.prototype._prepareObjectFromDesktop = function (file) {
    return {
      name: file.name,
      size: file.size,
      lastModifiedDate: file.lastModifiedDate
    };
  };

  FileWidget.prototype._renderListOfFiles = function () {
    var fragment = document.createDocumentFragment();
    this.fileCollection.files.forEach(function (elem) {
      var view = new Views.FileView(elem);
      fragment.appendChild(view.render().el);
    });
    return fragment;
  };

  FileWidget.prototype._renderResultOfAddFile = function (isAdded) {
    if (isAdded) {
      this._reRender();
    } else {
      alert('duplicate');
    }
  };

  /**
   * re render path of widget which shows file list
   * @private
   */
  FileWidget.prototype._reRender = function () {
    var elements = this.el.getElementsByClassName('fileView'),
      element = elements[0];
    while (element) {
      element.parentNode.removeChild(element);
      element = elements[0];
    }
    var footer = this.el.getElementsByClassName('widgetFooter')[0];
    var fileList = this._renderListOfFiles();
    footer.parentNode.insertBefore(fileList, footer);
//    this._renderSortMarkers();

  };

//  FileWidget.prototype._renderSortMarkers = function () {
//    var sorted = this.fileCollection.sorted;
//    this._removeSortMarkers();
//
//    var element;
//    var className;
//    if (sorted) {
//      if (sorted[0] === '-') {
//        className = 'sortDesc';
//        sorted = sorted.substr(1);
//      } else {
//        className = 'sortAsc';
//      }
//      element = this.el.getElementsByClassName(sorted)[0];
//      element.classList.add(className);
//    }
//  };

//  FileWidget.prototype._removeSortMarkers = function () {
//    this._removeClassName('sortAsc');
//    this._removeClassName('sortDesc');
//  };
//
//  FileWidget.prototype._removeClassName = function (className) {
//    var elements = this.el.getElementsByClassName(className),
//      element = elements[0];
//    while (element) {
//      element.classList.remove(className);
//      element = elements[0];
//    }
//  };

  Views.FileWidget = FileWidget;

})(window.MyM, window.MyV);