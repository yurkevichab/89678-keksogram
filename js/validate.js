/* global resizer: true*/
'use strict';
(function() {
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var resizeX = resizeForm['x'];
  var resizeY = resizeForm['y'];
  var resizeSize = resizeForm['size'];
  var inputsFilter = filterForm['upload-filter'];

  function dateForCookie() {
    var date = new Date();
    var bday = new Date(1986, 4, 5);
    date.setDate(date.getDate() + Math.round((date.getTime() - bday.getTime()) / (1000 * 60 * 60 * 24)));
    return date;
  }

  function filterToCookie() {
    for (var i = 0; i < inputsFilter.length; i++) {
      inputsFilter[i].onclick = function() {
        docCookies.setItem('filter', this.value, dateForCookie());
      };
    }
  }

  function validate() {
    var maxWidth = resizer.thisImageSize().width;
    var maxHeight = resizer.thisImageSize().height;
    var x = resizeX.value;
    var y = resizeY.value;
    var s = resizeSize.value;
    if (x + s > maxWidth || y + s > maxHeight) {
      resizeSize.max = Math.min(maxWidth - x, maxHeight - y);
      resizer.setConstraint();
    }
  }

  resizeX.onchange = validate;
  resizeY.onchange = validate;
  resizeSize.onchange = validate;

  filterToCookie();
})();
