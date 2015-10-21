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
    },
    className: 'picture',
    events: {
      'click': '_onClick',
      'click .picture-likes': '_likeThisModel'
    },
    _likeThisModel: function(evt) {
      evt.preventDefault();
      this.model.toggleLike();
    },

    render: function() {
      var newPictureImg = new Image();
      newPictureImg.src = this.model.get('url');
      this.el.querySelector('.picture-likes').innerHTML = this.model.get('likes');
      this.el.querySelector('.picture-comments').innerHTML = this.model.get('comments');

      this._onPhotoLoadTimeOut = setTimeout(function() {
        this.el.classList.add('picture-load-failure');
      }.bind(this), REQUEST_FAILURE_TIMEOUT);
      newPictureImg.addEventListener('load', this._onPhotoLoad);
      newPictureImg.addEventListener('error', this._onPhotoLoadError);
    },
    _onPhotoLoad: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      console.log(this.el);
      this.el.querySelector('img').src = evt.target.src;
      this._cleanupImageListeners(evt.target);
    },
    _onPhotoLoadError: function(evt) {
      this._cleanupImageListeners(evt.target);
      this.model.set('url', '');
      this.el.classList.add('picture-load-failure');
    },
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onPhotoLoad);
      image.removeEventListener('error', this._onPhotoLoadError);
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
