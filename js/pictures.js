/* global
 Gallery: true
 PhotosCollection: true
 PhotoView: true
 */
'use strict';
(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 12;
  var photosCollection = new PhotosCollection();
  var gallery = new Gallery();
  var renderedPictures = [];
  var currentPage = 0;
  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');

  function renderPictures(numberPage) {
    var pictureFragment = document.createDocumentFragment();
    var picturesFrom = numberPage * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;
    numberPage = numberPage || 0;

    if (numberPage === 0) {
      renderedPictures.forEach(function(picture) {
        picture.remove();
      });
      renderedPictures = [];
    }
    photosCollection.slice(picturesFrom, picturesTo).forEach(function(model) {
      var view = new PhotoView({model: model});
      view.render();
      renderedPictures.push(view);
      pictureFragment.appendChild(view.el);

      view.on('galleryclick', function() {
        gallery.setCurrentPhotoByUrl(photosCollection.indexOf(model));
        gallery.show();
      });
    });
    picturesContainer.appendChild(pictureFragment);
  }

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  function filterPictures(filerValue) {
    switch (filerValue) {
      case 'new':

        photosCollection.comparator = function(a, b) {
          if (a.get('date') > b.get('date')) {
            return -1;
          }
          if (a.get('date') === b.get('date')) {
            return 0;
          }
          if (a.get('date') < b.get('date')) {
            return 1;
          }
        };

        photosCollection.sort();
        break;
      case 'discussed':
        photosCollection.comparator = (function(a, b) {
          if (a.get('comments') > b.get('comments')) {
            return -1;
          }
          if (a.get('comments') === b.get('comments')) {
            return 0;
          }
          if (a.get('comments') < b.get('comments')) {
            return 1;
          }
        });
        photosCollection.sort();
        break;
      case 'popular':
      default:
        photosCollection.comparator = (function(a, b) {
          if (a.get('likes') > b.get('likes')) {
            return -1;
          }
          if (a.get('likes') === b.get('likes')) {
            return 0;
          }
          if (a.get('likes') < b.get('likes')) {
            return 1;
          }
        });
        photosCollection.sort();
        break;
    }
    localStorage.setItem('picturesFilter', filerValue);
  }

  function setActiveFilter(filterID) {
    filterPictures(filterID);
    currentPage = 0;
    renderPictures(currentPage);
    gallery.setPhotos(photosCollection);
  }

  function initFilters() {
    filters.addEventListener('click', function(evt) {
      if (evt.target.tagName === 'INPUT') {
        setActiveFilter(evt.target.value);
      }
    });
  }

  function isNextPageAvailible() {
    return !!photosCollection && currentPage < Math.ceil(photosCollection.length / PAGE_SIZE);
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

  function initScroll() {
    var someTimeOut;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeOut);
      someTimeOut = setTimeout(checkNextPage, 100);
    });
    window.addEventListener('loadrender', function() {
      currentPage++;
      renderPictures(currentPage);
    });
  }

  photosCollection.fetch({timeout: REQUEST_FAILURE_TIMEOUT}).success(function() {
    initFilters();
    initScroll();
    var activeFilter = localStorage.getItem('picturesFilter') || 'popular';
    filters['filter'].value = activeFilter;
    setActiveFilter(activeFilter);
  }).fail(function() {
    showLoadFailure();
  });
})();
