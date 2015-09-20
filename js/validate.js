(function (){
    var resizeForm = document.forms['upload-resize'];
    var resizeX = resizeForm['resize-x'];
    var resizeY = resizeForm['resize-y'];
    var resizeSize = resizeForm['resize-size'];
    var resizeImage = resizeForm.querySelector('.resize-image-preview');

    var inputsFilter = document.getElementsByName('upload-filter');

    resizeX.min = 0;
    resizeY.min = 0;
    resizeSize.min = 1;
    resizeSize.max = 4;

    //формируем дату Cookie
    function DateForCookie() {
        var date = new Date();
        var bday = new Date(1986,4,5);
        date.setDate(date.getDate()+ Math.round((date.getTime() - bday.getTime()) / (1000 * 60 * 60 * 24)));
        return date;  
    }
    //для всех input фильтра создаем событие, при нажатии записваются cookie
    function AddCookie() {
        for (var i = 0; i < inputsFilter.length; i++) {
            inputsFilter[i].onclick = function () {
                document.cookie = 'filter= ' + this.value + ';' + ' expires= ' + DateForCookie();
            }
        }
    }
  
    //функция для провери невозможности ввести(!) слишком маленькое значение или слишком большое
    function myfunction(r) {
        r.onchange = function (e) {
            if (r.value > r.max) {
                r.value = r.max;
            }
            if (r.value < r.min) {
                r.value = r.min;
            }
        }
    }
    //при подгрузке изображения узнаем его размер 
    resizeImage.onload = function () {
      
            resizeX.max = this.width;
            resizeY.max = this.height;          

    }
    myfunction(resizeX);
    myfunction(resizeY);
    myfunction(resizeSize);
    AddCookie();
   

})();