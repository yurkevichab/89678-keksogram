/* global
 Gallery: true
 PhotosCollection: true
 PhotoView: true
 */
'use strict';
(function() {
  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;
  /**
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 12;
  /**
   * @type {Backbone.Collections}
   */
  var photosCollection = new PhotosCollection();
  /**
   *  @type {Backbone.View}
   */
  var gallery = new Gallery();
  /**
   *
   *  @type {Array}
   */
  var renderedPictures = [];
  /**
   * Интекс текущей страницы
   *  @type {number}
   */
  var currentPage = 0;
  /**
   * Контейнер картинок
   *  @type {Element}
   */
  var picturesContainer = document.querySelector('.pictures');
  /**
   * Элемент переключатели фильтров
   * @type {Element}
   */
  var filters = document.querySelector('.filters');

  /**
   *
   * Добавляет фото на страницу по 12 штук
   * @param {number} numberPage
   */
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
        gallery.setCurrentIndexfromModel(model);
        gallery.show();
      });
    });
    picturesContainer.appendChild(pictureFragment);
  }

  /**
   * Если картинка не загрузилась добавляется класс ошибки загрузки
   */
  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  /**
   * Выполняет сортировку коллекции и добавляет значение текущей сортировки в localStorage
   * @param {string} filerValue
   */
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

  /**
   * В зависимости от фильтра перерисовывает фото
   * @param {string} filterID
   */
  function setActiveFilter(filterID) {
    filterPictures(filterID);
    currentPage = 0;
    renderPictures(currentPage);
    gallery.setPhotos(photosCollection);
  }

  /**
   * Добавлет Элементу фильтрам событие нажатия
   */
  function initFilters() {
    filters.addEventListener('click', function(evt) {
      if (evt.target.tagName === 'INPUT') {
        setActiveFilter(evt.target.value);
      }
    });
  }

  /**
   * Проверяет возможно ли отрисовать еще страницу с фото
   * @returns {boolean}
   */
  function isNextPageAvailible() {
    return !!photosCollection && currentPage < Math.ceil(photosCollection.length / PAGE_SIZE);
  }

  /**
   * Проверяет опустились ли мы достаточно по странице
   * @returns {boolean}
   */
  function isBottom() {
    var GAP = 100;
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  /**
   * Стреляет событием разрешающим отисовку еще фото
   */
  function checkNextPage() {
    if (isNextPageAvailible() && isBottom()) {
      window.dispatchEvent(new CustomEvent('loadrender'));
    }
  }

  /**
   * Метод добавлет события причастные к scroll
   */
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

  /**
   * Загрузка коллекции Backbone
   */
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
