'use strict';
(function() {
  var keys = {
    'LEFT': 37,
    'RIGHT': 39,
    'ESC': 27
  };
  var picturesContainer = document.querySelector('.pictures');
  var galleryElement = document.querySelector('.gallery-overlay');
  var closeButton = document.querySelector('.gallery-overlay-close');

  function havePicture(element) {
    while (element) {
      if (element.classList.contains('picture')) {
        return !element.classList.contains('picture-load-failure');
      }
      element = element.parentElement;
    }
    return false;
  }

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case keys.LEFT:
        console.log('Влево');
        break;
      case keys.RIGHT:
        console.log('Вправо');
        break;
      case keys.ESC:
        hideGallery();
        break;
      default: break;
    }
  }

  function hideGallery() {
    galleryElement.classList.add('invisible');
    closeButton.removeEventListener('click', hideGallery);
    closeButton.removeEventListener('keydown', keyHandler);
  }

  function showGallery() {
    galleryElement.classList.remove('invisible');
    closeButton.addEventListener('click', hideGallery);
    document.addEventListener('keydown', keyHandler);
  }


  picturesContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (havePicture(evt.target)) {
      showGallery();
    }
  });
})();
