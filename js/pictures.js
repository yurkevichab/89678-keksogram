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


  var pictures;
  var gallery = new Gallery();
  var renderedPictures = [];
  var currentPictures;
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
        picturesContainer.removeChild(picture.el);
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
        newFilerPictures = pictures.slice(0);
        break;
    }
    localStorage.setItem('picturesFilter', filerValue);
    currentPictures = newFilerPictures;
    photosCollection.reset(newFilerPictures);
  }

  function setActiveFilter(filterID) {
    filterPictures(currentPictures, filterID);
    currentPage = 0;
    renderPictures(currentPage);
    gallery.setPhotos(currentPictures);
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

  photosCollection.fetch({timeout: REQUEST_FAILURE_TIMEOUT}).success(function(loaded, state, jqXHR) {
    pictures = jqXHR.responseJSON;
    currentPictures = pictures;
    initFilters();
    initScroll();
    var activeFilter = localStorage.getItem('picturesFilter') || 'popular';
    filters['filter'].value = activeFilter;
    setActiveFilter(activeFilter);
  }).fail(function() {
    showLoadFailure();
  });
})();
