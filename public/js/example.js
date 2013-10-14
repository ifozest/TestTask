(function (Views) {

  /**
   * Example
   * @type {FileWidget}
   */
  var w = new Views.FileWidget();

  document.body.appendChild(w.render().el);

  var w2 = new Views.FileWidget();
  document.body.appendChild(w2.render().el);


})(window.MyV);