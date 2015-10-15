'use strict';
(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var picturesTemplate = document.querySelector('.picture-template');

  var Photo = function(data) {
    this._data = data;
    this._onClick = this._onClick.bind(this);
    this._element = null;
  };

  Photo.prototype.render = function(container) {
    var newPictureElement = picturesTemplate.content.children[0].cloneNode(true);
    var newPictureImg = new Image();
    newPictureImg.src = this._data['url'];

    newPictureElement.querySelector('.picture-likes').textContent = this._data['likes'];
    newPictureElement.querySelector('.picture-comments').textContent = this._data['comments'];

    container.appendChild(newPictureElement);

    var imageLoadTimeout = setTimeout(function() {
      newPictureElement.classList.add('picture-load-failure');
    }, REQUEST_FAILURE_TIMEOUT);

    newPictureImg.onload = function() {
      var oldImg = newPictureElement.querySelector('.picture img');
      newPictureImg.style.width = '182px';
      newPictureImg.style.height = '182px';
      newPictureElement.replaceChild(newPictureImg, oldImg);
      clearTimeout(imageLoadTimeout);
    };

    newPictureImg.onerror = function() {
      newPictureElement.classList.add('picture-load-failure');
    };
    this._element = newPictureElement;
    this._element.addEventListener('click', this._onClick);
  };

  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  Photo.prototype._onClick = function(evt) {
    evt.preventDefault();
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryEventClick = new CustomEvent('galleryclick', {detail: {pictureElement: this}});
      window.dispatchEvent(galleryEventClick);
    }
  };

  Photo.prototype.getCurrentPhoto = function() {
    return this._data.url;
  };

  window.Photo = Photo;
})();
