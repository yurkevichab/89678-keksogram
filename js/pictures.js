'use strict';
(function() {
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var pictures;
  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');

  function renderPictures(data) {
    picturesContainer.innerHTML = '';
    var picturesTemplate = document.getElementById('picture-template');
    var pictureFragment = document.createDocumentFragment();
    data.forEach(function(arr) {
      var newPictureElement = picturesTemplate.content.children[0].cloneNode(true);
      var newPictureImg = new Image();
      newPictureImg.src = arr['url'];

      newPictureElement.querySelector('.picture-likes').textContent = arr['likes'];
      newPictureElement.querySelector('.picture-comments').textContent = arr['comments'];

      pictureFragment.appendChild(newPictureElement);

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
    });
    picturesContainer.appendChild(pictureFragment);
  }

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  function loadPictures() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('Get', 'data/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function() {
      switch (xhr.readyState) {
        case ReadyState.DONE:
          if (xhr.status === 200) {
            picturesContainer.classList.remove('pictures-loading');
            var data = xhr.response;
            pictures = JSON.parse(data);
            renderPictures(pictures);
          }
          if (xhr.status >= 400) {
            picturesContainer.classList.remove('pictures-loading');
            showLoadFailure();
          }
          break;
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
        default:
          picturesContainer.classList.add('pictures-loading');
          break;
      }
    };
    xhr.ontimeout = function() {
      showLoadFailure();
    };

  }

  function filterPictures(filerValue) {
    var newFilerPictures = pictures.slice(0);
    switch (filerValue) {
      case 'new':
        newFilerPictures = newFilerPictures.sort(function(a, b) {
          if (a.date > b.date) {
            return -1;
          }
          if (a.date === b.date) {
            return 0;
          }
          if (a.date < b.date) {
            return 1;
          }
        });
        break;
      case 'discussed':
        newFilerPictures = newFilerPictures.sort(function(a, b) {
          if (a.comments > b.comments) {
            return -1;
          }
          if (a.comments === b.comments) {
            return 0;
          }
          if (a.comments < b.comments) {
            return 1;
          }
        });
        break;
      case 'popular':
      default :
        newFilerPictures = pictures.slice(0);
        break;
    }
    return newFilerPictures;
  }

  function initFilters() {
    loadPictures();
    var inputFilters = filters.querySelectorAll('.filters-radio');
    for (var i = 0; i < inputFilters.length; i++) {
      inputFilters[i].onchange = function(evt) {
        var newpictures = filterPictures(evt.target.value);
        renderPictures(newpictures);
      };
    }
  }
  initFilters();
})();
