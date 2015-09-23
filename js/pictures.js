(function (){
    var picturesContainer = document.querySelector('.pictures');
    var picturesTemplate = document.getElementById('picture-template');
    var filters = document.querySelector('.filters');
    var pictureFragment = document.createDocumentFragment();

    filters.classList.add('hidden');

    pictures.forEach(function (pictures, i) {
        var newPictureElement = picturesTemplate.content.children[0].cloneNode(true);
        var pictureImg = new Image();
        pictureImg.src = pictures['url'];

        newPictureElement.querySelector('.picture-likes').textContent = pictures['likes'];
        newPictureElement.querySelector('.picture-comments').textContent = pictures['comments'];

        pictureFragment.appendChild(newPictureElement);

        var imageLoadTimeout = setTimeout(function(){
            newPictureElement.classList.add('picture-load-failure');
        },10000);

        pictureImg.onload = function (){
            var newImg = newPictureElement.querySelector('.picture img');
            pictureImg.style.width = '182px';
            pictureImg.style.height = '182px';
            newPictureElement.replaceChild(pictureImg, newImg);
        };

        pictureImg.onerror = function (){
            newPictureElement.classList.add('picture-load-failure');
        };
    });
    picturesContainer.appendChild(pictureFragment);
    filters.classList.remove('hidden');
})();
