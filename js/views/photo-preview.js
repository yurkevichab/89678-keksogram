/* global Backbone: true */
'use strict';

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var GalleryPicture = Backbone.View.extend({
    initialize: function() {
      this._onPhotoLoad = this._onPhotoLoad.bind(this);
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      this._onLike = this._onLike.bind(this);
      this.model.set('liked', false);
    },
    tagName: 'img',
    className: 'gallery-overlay-image',

    like: function() {
      this.model.set('liked', true);
    },
    dislike: function() {
      this.model.set('liked', false);
    },


    render: function() {
      var newPictureImg = new Image();
      newPictureImg.src = this.model.get('url');
      newPictureImg.classList.add('gallery-overlay-image');
      newPictureImg.addEventListener('load', this._onPhotoLoad);
      newPictureImg.addEventListener('error', this._onPhotoLoadError);
      this._onPhotoLoadTimeOut = setTimeout(this._onPhotoLoadError, REQUEST_FAILURE_TIMEOUT);

    },

    //Функция для прорисовки нижних элементов Нравится и Комментарии
    //пытаюсь навесить обработчки нажатия на это поле(нравится)
    currentControls: function(element) {
      this._likeControls = element.querySelector('.likes-count');
      this._likeControls.removeEventListener('error', this._onLike);
      this._commentControls = element.querySelector('.comments-count');
      this._likeControls.innerHTML = this.model.get('likes');
      this._commentControls.innerHTML = this.model.get('comments');
      this._likeControls.addEventListener('click', this._onLike);
      return element;
    },
    _onPhotoLoadError: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this.el.classList.add('picture-big-load-failure');
      this._cleanupImageListeners(evt.target);
    },
    _onPhotoLoad: function(evt) {
      this.el.src = evt.target.src;
      clearTimeout(this._onPhotoLoadTimeOut);
      this._cleanupImageListeners(evt.target);
    },
    //собственно сама функция которая должна ловить событие клик по плю Нравится
    //убирает лайки и добавляет в зависимости от состояния флага
    _onLike: function() {
      if (!this.model.get('liked')) {
        this.model.set('likes', this.model.get('likes') + 1);
        this.like();
      } else {
        this.model.set('likes', this.model.get('likes') - 1);
        this.dislike();
      }
      console.log(this.model.get('likes'));
    },
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onPhotoLoad);
      image.removeEventListener('error', this._onPhotoLoadError);
    }
  });

  window.GalleryPicture = GalleryPicture;
})();
