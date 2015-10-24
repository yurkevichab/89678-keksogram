/* global Backbone: true */
'use strict';
(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
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
    _likeThisPhoto: function(evt) {
      evt.preventDefault();
      this.model.toggleLike();
    },
    render: function() {
      this._photo.src = this.model.get('url');
      this.el.querySelector('.picture-likes').innerHTML = this.model.get('likes');
      this.el.querySelector('.picture-comments').innerHTML = this.model.get('comments');
      this._onPhotoLoadTimeOut = setTimeout(this._onPhotoLoadError, REQUEST_FAILURE_TIMEOUT);
      this._photo.addEventListener('load', this._onPhotoLoad);
      this._photo.addEventListener('error', this._onPhotoLoadError);
    },
    _onPhotoLoad: function() {
      clearTimeout(this._onPhotoLoadTimeOut);
      this._cleanupImageListeners();
    },
    _onPhotoLoadError: function() {
      this._cleanupImageListeners();
      this.el.classList.add('picture-load-failure');
    },
    _cleanupImageListeners: function() {
      this._photo.removeEventListener('load', this._onPhotoLoad);
      this._photo.removeEventListener('error', this._onPhotoLoadError);
    },
    _onClick: function(evt) {
      evt.preventDefault();
      if (!evt.target.classList.contains('picture-load-failure') && !evt.target.classList.contains('picture-likes')) {
        this.trigger('galleryclick');
      }
    }
  });
  window.PhotoView = PhotoView;
})();
