(function (Views) {

  /**
   * Example
   * @type {Views.FileWidget}
   */

  var w = new Views.FileWidget();

  document.body.appendChild(w.render().el);

  document.addEventListener('dblclick', function () {

    console.log(w.serialize());

    var a = w.serialize();
    if (a.length >1 ) {
      var w3 = new Views.FileWidget(a);
      document.body.appendChild(w3.render().el);
    }

  }, false);


})(window.MyV);