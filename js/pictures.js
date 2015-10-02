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
  var currentPictures;
  var currentPage = 0;
  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');

  function renderPictures(data, numberPage, replace) {
    numberPage = numberPage || 0;
    replace = typeof replace != 'undefined'? replace : true;

    if(replace){
      picturesContainer.innerHTML = '';
      picturesContainer.classList.remove('pictures-loading');
    }

    var picturesTemplate = document.querySelector('.picture-template');
    var pictureFragment = document.createDocumentFragment();

    var picturesFrom = numberPage * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;
    data = data.slice(picturesFrom, picturesTo);

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
            pictures = JSON.parse(data);
            setActiveFilter(localStorage.getItem('picturesFilter'));
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
      default :
        newFilerPictures = arrPictures.slice(0);
        console.log(newFilerPictures);
        break;
    }
    localStorage.setItem('picturesFilter', filerValue);
    return newFilerPictures;
  }

  function setActiveFilter(filterID) {
    currentPictures = filterPictures(pictures, filterID);
    currentPage = 0;
    renderPictures(currentPictures, currentPage, true);
  }

  function initFilters() {
    if (localStorage.getItem('picturesFilter')){
      filters['filter'].value = localStorage.getItem('picturesFilter');
    }
    loadPictures();
    filters.addEventListener('click',function(evt){
      if(evt.target.tagName == 'INPUT'){
        setActiveFilter(evt.target.value);
      }
    });
  }

  function isNextPageAvailible(){

    return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
  }

  function isBottom(){
    var GAP = 100;
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  function checkNextPage(){
    if(isNextPageAvailible() && isBottom()){
      document.dispatchEvent(new CustomEvent('loadrender'))
    }
  }

  function initScroll(){
    var someTimeOut;
    //В вебинаре делают на window, но почему не на document?
    document.addEventListener('scroll', function(){
      clearTimeout(someTimeOut) ;
      someTimeOut = setTimeout(checkNextPage, 100);
    });
    document.addEventListener('loadrender', function(){
      currentPage++;
      renderPictures(currentPictures, currentPage, false);
    });
  }

  initFilters();
  initScroll();
})();
