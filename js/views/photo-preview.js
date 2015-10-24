/* global Backbone: true PhotoView: true*/
'use strict';

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var template = document.querySelector('.gallery-overlay-preview').cloneNode(true);
  var GalleryPicture = PhotoView.extend({
    initialize: function() {
      this._onPhotoLoad = this._onPhotoLoad.bind(this);
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      var el = template.cloneNode(true);
      this.setElement(el);
      this._onPhotoLoadTimeOut = setTimeout(this._onPhotoLoadError, REQUEST_FAILURE_TIMEOUT);
      this._photo = this.el.querySelector('.gallery-overlay-image');
      this.render();
      this.listenTo(this.model, 'change', this.render);
    },
    events: {
      'click .likes-count': '_likeThisPhoto'
    },
    render: function() {
      this._photo.src = this.model.get('url');
      this._photo.addEventListener('error', this._onPhotoLoadError);
      this._photo.addEventListener('load', this._onPhotoLoad);
      this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
      this.el.querySelector('.comments-count').innerHTML = this.model.get('comments');
    },
    _onPhotoLoadError: function() {
      clearTimeout(this._onPhotoLoadTimeOut);
      this._photo.classList.add('picture-big-load-failure');
      this.model.set('url', '');
      this._cleanupImageListeners();
    }
  });
  window.GalleryPicture = GalleryPicture;
})();
