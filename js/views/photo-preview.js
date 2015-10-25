/* global Backbone: true PhotoView: true*/
'use strict';

(function() {
  /**
   * Копия блока картинки
   * @type {Element}
   */
  var template = document.querySelector('.gallery-overlay-preview').cloneNode(true);
  var GalleryPicture = PhotoView.extend({
    initialize: function() {
      this._onPhotoLoad = this._onPhotoLoad.bind(this);
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      var el = template.cloneNode(true);
      this.setElement(el);
      this._photo = this.el.querySelector('.gallery-overlay-image');
      this.render();
      this.listenTo(this.model, 'change', this.render);
    },
    events: {
      'click .gallery-overlay-controls-like': '_likeThisPhoto'
    },
    /**
     * Выводит колличество лайков и комментов
     * @override
     */
    loadLikesComments: function() {
      this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
      this.el.querySelector('.comments-count').innerHTML = this.model.get('comments');
    },
    /**
     * @private
     * @override
     */
    _onPhotoLoadError: function() {
      clearTimeout(this._onPhotoLoadTimeOut);
      this._photo.classList.add('picture-big-load-failure');
      this.model.set('url', '');
      this.cleanupImageListeners();
    }
  });
  window.GalleryPicture = GalleryPicture;
})();
