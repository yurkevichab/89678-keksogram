/* global Backbone: true GalleryPicture: true*/
'use strict';

(function() {
  var template = document.querySelector('.gallery-overlay-preview').cloneNode(true);
  var GalleryVideo = GalleryPicture.extend({
    initialize: function() {
      var el = template.cloneNode(true);
      this.setElement(el);
      this._photo = this.el.querySelector('.gallery-overlay-image');
      this.listenTo(this.model, 'change', this.loadLikesComments);
      this.createVideoElement();
      this.loadLikesComments();
    },
    events: {
      'click video': 'checkPlayVideo',
      'click .gallery-overlay-controls-like': '_likeThisPhoto'
    },
    /**
     * Создаем видео элемент и записываем его в this.el вместо картинки
     */
    createVideoElement: function() {
      this._video = document.createElement('video');
      this._video.loop = true;
      this._video.controls = false;
      this._video.autoplay = false;
      this._video.autoplay = true;
      this._video.poster = this.model.get('preview');
      this._video.src = this.model.get('url');
      this.el.replaceChild(this._video, this._photo);
    },
    /**
     * Проверка на проигрывание и остановка или воспроизведение видео
     */
    checkPlayVideo: function() {
      if (this._video.paused) {
        this._video.play();
      } else {
        this._video.pause();
      }
    },
    /**
     * Останавливаем видео
     */
    destroy: function() {
      if (this._video) {
        this._video.pause();
      }
    }
  });
  window.GalleryVideo = GalleryVideo;
})();
