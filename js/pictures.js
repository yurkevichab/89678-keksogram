/* global Photo: true Gallery: true */
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
  var PAGE_SIZE = 12;

  var pictures;
  var gallery = new Gallery();
  var renderedPictures = [];
  var currentPictures;
  var currentPage = 0;
  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');

  function renderPictures(data, numberPage) {
    numberPage = numberPage || 0;
    if (numberPage === 0) {
      renderedPictures.forEach(function(picture) {
        picture.unrender();
      });
      renderedPictures = [];
    }
    var pictureFragment = document.createDocumentFragment();

    var picturesFrom = numberPage * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;
    data = data.slice(picturesFrom, picturesTo);

    data.forEach(function(arr) {
      var newPicture = new Photo(arr);
      newPicture.render(pictureFragment);
      renderedPictures.push(newPicture);
    });
    picturesContainer.appendChild(pictureFragment);
  }

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  function loadPictures(callback) {
    filters.classList.add('hidden');
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('Get', 'data/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function() {
      switch (xhr.readyState) {
        case ReadyState.DONE:
          picturesContainer.classList.remove('pictures-loading');
          if (xhr.status === 200) {
            var data = xhr.response;
            callback(JSON.parse(data));
            filters.classList.remove('hidden');
          }
          if (xhr.status >= 400) {
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
      picturesContainer.classList.remove('pictures-loading');
      showLoadFailure();
    };
  }

  function filterPictures(arrPictures, filerValue) {
    var newFilerPictures = arrPictures.slice(0);
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
      default:
        newFilerPictures = arrPictures.slice(0);
        break;
    }
    localStorage.setItem('picturesFilter', filerValue);
    return newFilerPictures;
  }

  function setActiveFilter(filterID) {
    currentPictures = filterPictures(pictures, filterID);
    currentPage = 0;
    renderPictures(currentPictures, currentPage);
  }

  function initFilters() {
    filters.addEventListener('click', function(evt) {
      if (evt.target.tagName === 'INPUT') {
        setActiveFilter(evt.target.value);
      }
    });
  }

  function isNextPageAvailible() {
    return !!pictures && currentPage < Math.ceil(pictures.length / PAGE_SIZE);
  }

  function isBottom() {
    var GAP = 100;
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isNextPageAvailible() && isBottom()) {
      window.dispatchEvent(new CustomEvent('loadrender'));
    }
  }

  function getPhotos() {
    return currentPictures.map(function(obj) {
      return obj.url;
    });
  }

  function initScroll() {
    var someTimeOut;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeOut);
      someTimeOut = setTimeout(checkNextPage, 100);
    });
    window.addEventListener('loadrender', function() {
      currentPage++;
      renderPictures(currentPictures, currentPage);
    });
  }

  function initGallery() {
    window.addEventListener('galleryclick', function(evt) {
      evt.preventDefault();
      gallery.setPhotos(getPhotos());
      gallery.setCurrentPhotoByUrl(evt.detail.pictureElement.getCurrentPhoto());
      gallery.show();
    });
  }

  initFilters();
  initGallery();
  initScroll();

  loadPictures(function(data) {
    pictures = data;
    var activeFilter = localStorage.getItem('picturesFilter') || 'popular';
    filters['filter'].value = activeFilter;
    setActiveFilter(activeFilter);
  });
})();
