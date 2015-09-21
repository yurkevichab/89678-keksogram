(function (){
    var resizeForm = document.forms['upload-resize'];

    var resizeX = resizeForm['resize-x'];
    var resizeY = resizeForm['resize-y'];
    var resizeSize = resizeForm['resize-size'];

    var resizeImage = resizeForm.querySelector('.resize-image-preview');

    var inputsFilter = document.getElementsByName('upload-filter');

    var maxwidth, maxheight;

    //формируем дату Cookie
    function DateForCookie() {
        var date = new Date();
        var bday = new Date(1986,4,5);
        date.setDate(date.getDate() + Math.round((date.getTime() - bday.getTime()) / (1000 * 60 * 60 * 24)));
        return date;  
    } 
    //для всех input фильтра создаем событие, при нажатии записваются cookie
    function FilterFromCookie() {
        for (var i = 0; i < inputsFilter.length; i++) {
            inputsFilter[i].onclick = function () {
                docCookies.setItem('filter', this.value, DateForCookie());
                // document.cookie = 'filter= ' + this.value + ';' + ' expires= ' + DateForCookie();
            }
        }
    }

    function Validate() {
        var maxX,maxY;
        resizeX.min = resizeX.value = 1;
        resizeY.min = resizeY.value = 1;
        resizeSize.min = resizeSize.value = 1;

        resizeX.onchange = function () {
        resizeX.max = maxwidth - resizeSize.value;
        }
        resizeY.onchange = function () {
          
            resizeY.max = maxheight - resizeSize.value;
        }
        resizeSize.onchange = function () {
                var maxX = 0, maxY = 0;
                maxX = maxwidth - resizeX.value;
                maxY = maxheight - resizeY.value;
                resizeSize.max = (maxX >= maxY) ? maxY : maxX;      
        }
    }
    //при подгрузке изображения узнаем его размер 
    resizeImage.onload = function () {
        maxwidth = this.width;
        maxheight = this.height;
        console.log(maxwidth, maxheight);
    }
    Validate();
    FilterFromCookie();
})();
