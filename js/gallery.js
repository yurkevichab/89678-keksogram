'use strict';
(function() {
  var keys = {
    'LEFT': 37,
    'RIGHT': 39,
    'ESC': 27
  };

  function arrayBounds(arr, index) {
    if (index === 0 || index === arr.length) {
      return false;
    }
    return true;
  }

  var Gallery = function() {
    this._element = document.querySelector('.gallery-overlay');
    this._closeButton = document.querySelector('.gallery-overlay-close');
    this._currentImg = this._element.querySelector('.gallery-overlay-image');
    this._pictureElement = this._element.querySelector('.gallery-overlay-preview');
    this._currentPhoto = 0;
    this._photos = [];
    this.currentKey = '';
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    this.currentKey = evt.keyCode;
    switch (this.currentKey) {
      case keys.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;
      case keys.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        break;
      case keys.ESC:
        this.hide();
        break;
      default:
        break;
    }
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this._pictureElement.removeEventListener('click', this._onPhotoClick);
  };

  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    this._pictureElement.addEventListener('click', this._onPhotoClick);
    this._showCurrentPhoto(this._currentPhoto);
  };

  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  Gallery.prototype.setPhotos = function(photo, photos) {
    this._photos = photos;
    this._currentPhoto = photos.indexOf(photo);
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    if (arrayBounds(this._photos, index)) {
      this._currentPhoto = index;
      this._showCurrentPhoto();
    }
  };

  Gallery.prototype._showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';
    var imgElement = new Image();
    imgElement.src = this._photos[this._currentPhoto];
    imgElement.onload = function() {
      this._pictureElement.appendChild(imgElement);
    }.bind(this);

    //Вот тут я проверяю: Если картинка ошибочная, загрузика мне следующую картинку в зависимости от нажатой кнопки
    imgElement.onerror = function() {
      if (this.currentKey === keys.LEFT) {
        this.setCurrentPhoto(this._currentPhoto - 1);
      }
      if (this.currentKey === keys.RIGHT) {
        this.setCurrentPhoto(this._currentPhoto + 1);
      }
    }.bind(this);
  };

  window.Gallery = Gallery;
})();
