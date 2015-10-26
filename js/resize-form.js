/* global resizer: true*/
'use strict';
(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  //var resizeX = resizeForm['x'];
 // var resizeY = resizeForm['y'];
  var resizeSize = resizeForm['size'];
 // var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];
  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    // filterForm.elements['filter-image-src'] = previewImage.src;
    filterForm.querySelector('.filter-image-preview').src = resizer.exportImage().src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
  //window.addEventListener('resizerchange', function() {
  //  var maxWidth = previewImage.width;
  //  var maxHeight = previewImage.height;
  //  var x = resizeX.value;
  //  var y = resizeY.value;
  //  var s = resizeSize.value;
  //  if (((x + s) > maxWidth) || ((y + s) > maxHeight)) {
  //    resizer.setConstraint(-(x-resizer.getConstraint().x) / 2, -(y-resizer.getConstraint().y) / 2, s);
  //  }
  //
  //});

  /**
   * Событие изменения кнопки Сторона. Почему все едет...Картинка смещается.
   */
  resizeSize.addEventListener('change', function() {
    resizer.getConstraint().side = resizeSize.value;
    resizer.redraw();
    // resizer.setConstraint(resizer.getConstraint().x,resizer.getConstraint().y,resizeSize.value);
  });
})();
