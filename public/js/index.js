(function (Models, Views) {

  var Widget = function (elements) {
    this.fileCollection = new Models.FileCollection(elements);
    this.fileCollection.widget = this;
  };


  /**
   * Render
   * @returns {*}
   */
  Widget.prototype.render = function () {
    var fragment = document.createDocumentFragment(),
      table = document.createElement('table'),
      tbody = document.createElement('tbody');


    table.appendChild(tbody);
    table.className = 'table table-striped table-bordered table-hover table-condensed';
    this._renderHeader(tbody);

    var fr = document.createDocumentFragment();
    this.fileCollection.files.forEach(function (elem) {
      var view = new Views.FileView(elem);
      fr.appendChild(view.render().el);
    });

    tbody.appendChild(fr);
    this._renderFooter(tbody);
    fragment.appendChild(table);

    this.hover.addEventListener('drop', this._dropEvent.bind(this), false);
    this.hover.addEventListener('dragleave', this._dragLeave.bind(this), false);
    table.addEventListener('dragover', this._dragOver.bind(this), false);

    this.el = table;

    return this;
  };


  Widget.prototype._renderHeader = function (tbody) {

    var tr = document.createElement('tr'),
      hover = document.createElement('div'),
      nameTh = document.createElement('th'),
      sizeTh = document.createElement('th'),
      dateTh = document.createElement('th');

    hover.className = 'hover';
    nameTh.innerHTML = 'Name';
    sizeTh.innerHTML = 'Size';
    dateTh.innerHTML = 'Date Modified';

    tr.appendChild(nameTh);
    tr.appendChild(sizeTh);
    tr.appendChild(dateTh);
    nameTh.appendChild(hover);
    this.hover = hover;
    tbody.appendChild(tr);

  };

  Widget.prototype._renderFooter = function (tbody) {
    var tr = document.createElement('tr'),
      addNewFooter = document.createElement('td');

    addNewFooter.innerHTML = '+ Add new';
    addNewFooter.setAttribute('colspan', '3');
    tr.className = 'widgetFooter';
    tr.appendChild(addNewFooter);

    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.style.display = 'none';

    tr.addEventListener('click', this._clickFooterEvent().bind(this), false);
    input.addEventListener('change', this._inputFileEvent.bind(this), false);

    tr.appendChild(input);
    tbody.appendChild(tr);
  };

  Widget.prototype._dropEvent = function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.hover.style.display = 'none';
    var dt = e.dataTransfer,
      data = dt.getData('text'),
      file = {};

    if (data) {
      file = JSON.parse(data);
    } else {
      file = dt.files[0];
      file = this._prepareObjectFromDesktop(file);
    }
    if (file) {
      var isAdded = this.fileCollection.addFile(file);
      this._renderResultOfAddFile(isAdded);
    } else {
      alert('error');
    }
  };


  Widget.prototype._dragLeave = function (e) {
    this.hover.style.display = 'none';
  };

  /**
   * Workaround of html dragleave event
   * @param e
   * @private
   */
  Widget.prototype._dragOver = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var hover = this.hover,
      el = this.el;
    hover.style.width = el.offsetWidth + 'px';
    hover.style.height = el.offsetHeight + 'px';
    hover.style.display = 'inline';
  };

  Widget.prototype._clickFooterEvent = function(){
    var i = this.el.getElementsByTagName('input')[0];
    i.click();
  };

  Widget.prototype._inputFileEvent = function (e) {
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
  Widget.prototype._createAnotherInput = function(){
    var i = this.el.getElementsByTagName('input')[0],
      clone = i.cloneNode(true);
    clone.addEventListener('change', this._inputFileEvent.bind(this), false);
    i.parentNode.replaceChild(clone, i);
  }

  Widget.prototype._prepareObjectFromDesktop = function (file) {
    var object = {
      name: file.name,
      size: file.size,
      lastModifiedDate: file.lastModifiedDate.getTime()
    };
    return object;
  };

  Widget.prototype._renderResultOfAddFile = function(isAdded){
    if (isAdded) {
      this._rerender();
    } else {
      alert('duplicate');
    }
  };


  Widget.prototype._rerender = function () {
    var elements = this.el.getElementsByClassName('fileView'),
      element;
    while (element = elements[0]) {
      element.parentNode.removeChild(element);
    }
    var footer = this.el.getElementsByClassName('widgetFooter')[0];
    this.fileCollection.files.forEach(function (elem) {
      var view = new Views.FileView(elem);
      footer.parentNode.insertBefore(view.render().el, footer);
    });
  };








  /**
   * Entry point
   * @type {Widget}
   */
  var w = new Widget();

  document.body.appendChild(w.render().el);

  var w2 = new Widget();
  document.body.appendChild(w2.render().el);


})(window.MyM, window.MyV);