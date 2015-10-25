/* global Backbone: true */
'use strict';
(function() {
  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;
  /**
   * Копия шаблона блока картинки
   * @type {Element}
   */
  var picturesTemplate = document.querySelector('.picture-template');
  var PhotoView = Backbone.View.extend({
    initialize: function() {
      this._onClick = this._onClick.bind(this);
      this._onPhotoLoad = this._onPhotoLoad.bind(this);
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      this.setElement(picturesTemplate.content.children[0].cloneNode(true));
      this.listenTo(this.model, 'change', this.render);
      this._photo = this.el.querySelector('img');
    },
    events: {
      'click': '_onClick',
      'click .picture-likes': '_likeThisPhoto'
    },
    /**
     * Добавляет Like к фото
     * @param {Event} evt
     * @private
     */
    _likeThisPhoto: function(evt) {
      evt.preventDefault();
      this.model.toggleLike();
    },
    render: function() {
      this._photo.src = this.model.get('url');
      this._onPhotoLoadTimeOut = setTimeout(this._onPhotoLoadError, REQUEST_FAILURE_TIMEOUT);
      this._photo.addEventListener('load', this._onPhotoLoad);
      this._photo.addEventListener('error', this._onPhotoLoadError);
      this.loadLikesComments();
    },
    /**
     * Выводит колличество лайков и комментов
     */
    loadLikesComments: function() {
      this.el.querySelector('.picture-likes').innerHTML = this.model.get('likes');
      this.el.querySelector('.picture-comments').innerHTML = this.model.get('comments');
    },

    /**
     * @private
     */
    _onPhotoLoad: function() {
      clearTimeout(this._onPhotoLoadTimeOut);
      this.cleanupImageListeners();
    },
    /**
     * @private
     */
    _onPhotoLoadError: function() {
      this.cleanupImageListeners();
      this.el.classList.add('picture-load-failure');
    },
    /**
     * Убирает события у картинки
     */
    cleanupImageListeners: function() {
      this._photo.removeEventListener('load', this._onPhotoLoad);
      this._photo.removeEventListener('error', this._onPhotoLoadError);
    },
    /**
     * Запуск события для показа галереи
     * @private
     */
    _onClick: function(evt) {
      evt.preventDefault();
      if (!evt.target.classList.contains('picture-load-failure') && !evt.target.classList.contains('picture-likes')) {
        this.trigger('galleryclick');
      }
    }
  });
  window.PhotoView = PhotoView;
})();
