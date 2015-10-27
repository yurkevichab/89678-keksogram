/* global resizer: true*/
'use strict';
(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var resizeX = resizeForm['x'];
  var resizeY = resizeForm['y'];
  var resizeSize = resizeForm['size'];
  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];
  resizeX.min = resizeX.value = 0;
  resizeY.min = resizeY.value = 0;
  prevButton.onclick = function(evt) {
    evt.preventDefault();
    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;
    filterForm.querySelector('.filter-image-preview').src = resizer.exportImage().src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

  window.addEventListener('resizerchange', function() {
    var maxWidth = previewImage.width;
    var maxHeight = previewImage.height;
    var x = resizeX.value;
    var y = resizeY.value;
    var s = resizeSize.value;
    if (((x + s) > maxWidth) || ((y + s) > maxHeight)) {
      resizeSize.max = Math.min(maxWidth - resizeX.value, maxHeight - resizeY.value);
      resizer.setConstraint(resizer.getConstraint().x, resizer.getConstraint().y, resizer.getConstraint().side);
    }
  });

  window.addEventListener('pictureload', function() {
    resizeSize.value = resizer.getConstraint().side;
  });

  resizeSize.addEventListener('change', function() {
    resizer.setConstraint(
      resizer.getConstraint().x - ((resizeSize.value - resizer.getConstraint().side) / 2),
      resizer.getConstraint().y - ((resizeSize.value - resizer.getConstraint().side) / 2),
      resizeSize.value);
  });
})();
