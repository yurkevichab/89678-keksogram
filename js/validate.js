'use strict';
(function() {
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var resizeImage = resizeForm.querySelector('.resize-image-preview');
  var resizeX = resizeForm['resize-x'];
  var resizeY = resizeForm['resize-y'];
  var resizeSize = resizeForm['resize-size'];
  var inputsFilter = filterForm['upload-filter'];

  var maxWidth = 0, maxHeight = 0;

  resizeX.min = resizeX.value = 0;
  resizeY.min = resizeY.value = 0;
  resizeSize.min = resizeSize.value = 1;

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
    var x = resizeX.value;
    var y = resizeY.value;
    var s = resizeSize.value;
    if (((x + s) > maxWidth) || ((y + s) > maxHeight)) {
      resizeX.max = maxWidth - resizeSize.value;
      resizeY.max = maxHeight - resizeSize.value;
      resizeSize.max = Math.min(maxWidth - resizeX.value, maxHeight - resizeY.value);
    }
  }

  resizeX.onchange = validate;
  resizeY.onchange = validate;
  resizeSize.onchange = validate;

  resizeImage.onload = function() {
    maxWidth = this.width;
    maxHeight = this.height;
  };
  filterToCookie();
})();
