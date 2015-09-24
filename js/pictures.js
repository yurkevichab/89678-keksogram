(function (){
    var picturesContainer = document.querySelector('.pictures');
    var picturesTemplate = document.getElementById('picture-template');
    var filters = document.querySelector('.filters');
    var pictureFragment = document.createDocumentFragment();

    filters.classList.add('hidden');

    pictures.forEach(function (pictures, i) {
        var newPictureElement = picturesTemplate.content.children[0].cloneNode(true);
        var newPictureImg = new Image();
        newPictureImg.src = pictures['url'];

        newPictureElement.querySelector('.picture-likes').textContent = pictures['likes'];
        newPictureElement.querySelector('.picture-comments').textContent = pictures['comments'];

        pictureFragment.appendChild(newPictureElement);

        var imageLoadTimeout = setTimeout(function(){
            newPictureElement.classList.add('picture-load-failure');
        }, 10000);

        newPictureImg.onload = function (){
            var oldImg = newPictureElement.querySelector('.picture img');
            newPictureImg.style.width = '182px';
            newPictureImg.style.height = '182px';
            newPictureElement.replaceChild(newPictureImg, oldImg);
        };

        newPictureImg.onerror = function (){
            newPictureElement.classList.add('picture-load-failure');
        };
    });
    picturesContainer.appendChild(pictureFragment);
    filters.classList.remove('hidden');
})();
