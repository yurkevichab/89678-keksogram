/* global Backbone: true*/
'use strict';

(function() {

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var template = document.querySelector('.gallery-overlay-preview').cloneNode(true);
  var GalleryPicture = Backbone.View.extend({
    initialize: function() {
      this._onPhotoLoad = this._onPhotoLoad.bind(this);
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      var el = template.cloneNode(true);
      this.setElement(el);
      this._onPhotoLoadTimeOut = setTimeout(this._onPhotoLoadError, REQUEST_FAILURE_TIMEOUT);
      this.model.set('liked', false);
      this.render();
      this.listenTo(this.model, 'change', this.render);
    },
    events: {
      'click .likes-count': '_likeThisModel'
    },
    _likeThisModel: function() {
      this.model._onLike();
    },
    render: function() {
      this.el.querySelector('.gallery-overlay-image').src = this.model.get('url');
      this.el.querySelector('.gallery-overlay-image').addEventListener('error', this._onPhotoLoadError);
      this.el.querySelector('.gallery-overlay-image').addEventListener('load', this._onPhotoLoad);
      this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
      this.el.querySelector('.comments-count').innerHTML = this.model.get('comments');
    },


    _onPhotoLoadError: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this.el.querySelector('.gallery-overlay-image').classList.add('picture-big-load-failure');
      this._cleanupImageListeners(evt.target);
    },
    _onPhotoLoad: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this._cleanupImageListeners(evt.target);
    },

    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onPhotoLoad);
      image.removeEventListener('error', this._onPhotoLoadError);
    }
  });

  window.GalleryPicture = GalleryPicture;
})();
