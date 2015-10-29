/* global Backbone: true GalleryPicture: true GalleryVideo: true */
'use strict';
(function() {
  /**
   * @type {Object.<string, number>}
   */
  var keys = {
    'LEFT': 37,
    'RIGHT': 39,
    'ESC': 27
  };

  /**
   * @param {Array} arr
   * @param {number} index
   * @returns {boolean}
   */
  function arrayBounds(arr, index) {
    if (index < 0 || index === arr.length) {
      return false;
    }
    return true;
  }

  /**
   * @constructor
   */
  var Gallery = function() {
    this._photos = new Backbone.Collection();
    this._element = document.querySelector('.gallery-overlay');
    this._closeButton = document.querySelector('.gallery-overlay-close');
    this._pictureElement = this._element.querySelector('.gallery-overlay-preview');
    this.galleryPicture = null;
    this._currentPhoto = 0;
    this.currentKey = '';
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
  };
  /**
   * В зависимости от нажатой клавиши выполняет дейтвия закрытия галереи/следующее/предыдущее фото
   * @param {Event} evt
   * @private
   */
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
  /**
   * Метод для скрытия блока галереи
   */
  Gallery.prototype.hide = function() {
    if (this.galleryPicture) {
      this.galleryPicture.destroy();
    }
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this._pictureElement.removeEventListener('click', this._onPhotoClick);
  };
  /**
   * Метод для показа блока галереи
   */
  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    this._showCurrentPhoto(this._currentPhoto);
  };
  /**
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onPhotoClick = function(evt) {
    if (evt.target.tagName === 'IMG') {
      this.setCurrentPhoto(this._currentPhoto + 1);
    }
  };
  /**
   * Нажатие по крестику в галерее
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };
  /**
   * Устанавливает текущую коллекию
   * @param {Backbone.Collection} photos
   */
  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };
  /**
   * Устанавливает индекс текущей модели
   * @param {Backbone.Model} model
   */
  Gallery.prototype.setCurrentIndexfromModel = function(model) {
    this._currentPhoto = this._photos.indexOf(model);
  };
  /**
   * Проверяет не вышли ли мы за границы текущего колличества фото
   * @param {number} index
   */
  Gallery.prototype.setCurrentPhoto = function(index) {
    if (arrayBounds(this._photos, index)) {
      this._currentPhoto = index;
      this._showCurrentPhoto();
    }
  };
  /**
   * Выводит текущую фотографию
   * @private
   */
  Gallery.prototype._showCurrentPhoto = function() {
    if (this._photos.at(this._currentPhoto).get('preview')) {
      this.galleryPicture = new GalleryVideo({model: this._photos.at(this._currentPhoto)});
    } else {
      this.galleryPicture = new GalleryPicture({model: this._photos.at(this._currentPhoto)});
    }

    this._element.replaceChild(this.galleryPicture.el, this._pictureElement);
    this._pictureElement = this.galleryPicture.el;
    this._pictureElement.addEventListener('click', this._onPhotoClick);
  };
  window.Gallery = Gallery;
})();
