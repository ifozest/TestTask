(function (Models, Views) {

  var Widget = function (elements) {
    this.fileCollection = new Models.FileCollection(elements);
    this.fileCollection.widget = this;
  };

  Widget.prototype.dropEvent = function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.hover.style.display = 'none';

    var dt = e.dataTransfer;
    var data = dt.getData('text');
    if (data) {
      var json = JSON.parse(data);
      if (!this.fileCollection.files.some(function (element) {
        return element.attributes.data === json.data;
      })) {
        this.fileCollection.addFile(json);
        this._rerender();
      } else {
        alert('error');
      }

    } else {
      var file = dt.files[0];

      var reader = new FileReader();
      reader.addEventListener('loadend', function (event) {
        var data = event.target.result;
        if (!this.fileCollection.files.some(function (element) {
          return element.attributes.data === data;
        })) {
          file.data = data;
          this.fileCollection.addFile(file);
          this._rerender();
        } else {
          alert('error');
        }
      }.bind(this), false);
      reader.readAsDataURL(file);
    }


  };

  Widget.prototype.dragOver = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var hover = this.hover,
      el = this.el;
    hover.style.width = el.offsetWidth + 'px';
    hover.style.height = el.offsetHeight + 'px';
    hover.style.display = 'inline';
  };

  Widget.prototype.dragLeave = function (e) {
    this.hover.style.display = 'none';
    console.log('leave');
  };


  Widget.prototype.addFile = function (file) {
    console.log(file);
  };

  Widget.prototype.sortByName = function (e) {
    var classList = e.target.classList;
    classList.add('sortDesc');
    this.fileCollection.sortBySize();
    this._rerender();
    console.log(this);
  };


  /**
   * Serialize data from widget
   * @returns {Array}
   */
  Widget.prototype.serialize = function () {
    var serializedData = [];
    this.files.forEach(function (elem) {
      serializedData.push(elem.toJSON());
    });
    return serializedData;
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


    this.hover.addEventListener('drop', this.dropEvent.bind(this), false);
    this.hover.addEventListener('dragleave', this.dragLeave.bind(this), false);
    table.addEventListener('dragover', this.dragOver.bind(this), false);

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
    nameTh.appendChild(this.hover);
    this.hover = hover;
    nameTh.innerHTML = 'Name';


    sizeTh.innerHTML = 'Size';
    sizeTh.className = 'size';
    dateTh.innerHTML = 'Date Modified';

    tr.appendChild(nameTh);
    tr.appendChild(sizeTh);
    tr.appendChild(dateTh);

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

    tr.addEventListener('click', function (e) {
      input.click();
    }, false);

    //TODO the same as file reader upstair
    input.addEventListener('change', function (e) {
      console.log(this.value);
      console.log(e);
    }, false);


    tr.appendChild(input);

    tbody.appendChild(tr);
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