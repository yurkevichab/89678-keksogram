/* global resizer: true*/
'use strict';
(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var resizeX = resizeForm['x'];
  var resizeY = resizeForm['y'];
  var resizeSize = resizeForm['size'];
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

    filterForm.querySelector('.filter-image-preview').src = resizer.exportImage().src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

  window.addEventListener('resizerchange', function() {
    resizeX.value = parseInt(resizer.getConstraint().x, 10);
    resizeY.value = parseInt(resizer.getConstraint().y, 10);
  });

  window.addEventListener('pictureload', function() {
    resizeSize.value = parseInt(resizer.getConstraint().side, 10);
    resizeX.value = parseInt(resizer.getConstraint().x, 10);
    resizeY.value = parseInt(resizer.getConstraint().y, 10);
  });

  resizeSize.addEventListener('change', function() {
    resizer.setConstraint(
      resizer.getConstraint().x - ((resizeSize.value - resizer.getConstraint().side) / 2),
      resizer.getConstraint().y - ((resizeSize.value - resizer.getConstraint().side) / 2),
      parseFloat(resizeSize.value));
  });
})();
