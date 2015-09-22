(function (){
    var resizeForm = document.forms['upload-resize'];
    var filterForm = document.forms['upload-filter'];

    var resizeImage = resizeForm.querySelector('.resize-image-preview');
    var resizeX = resizeForm['resize-x'];
    var resizeY = resizeForm['resize-y'];
    var resizeSize = resizeForm['resize-size'];
    var inputsFilter = filterForm['upload-filter'];

    var maxWidth, maxHeight;

    resizeX.min = resizeX.value = 0;
    resizeY.min = resizeY.value = 0;
    resizeSize.min = resizeSize.value = 1;

    function dateForCookie() {
        var date = new Date();
        var bday = new Date(1986, 4, 5);
        date.setDate(date.getDate() + Math.round((date.getTime() - bday.getTime()) / (1000 * 60 * 60 * 24)));
        return date;
    }

    function filterToCookie() {
        for (var i = 0; i < inputsFilter.length; i++) {
            inputsFilter[i].onclick = function () {
                docCookies.setItem('filter', this.value, DateForCookie());
            }
        }
    }

    function validate() {
        var x = resizeX.value;
        var y = resizeY.value;
        var s = resizeSize.value;
        if (((x + s) > maxwidth) || ((y + s) > maxheight)) {
            resizeX.max = maxwidth - resizeSize.value;
            resizeY.max = maxheight - resizeSize.value;
            resizeSize.max = Math.min(maxwidth - resizeX.value, maxheight - resizeY.value);
        }
    }

        resizeX.onchange = Validate;
        resizeY.onchange = Validate;
        resizeSize.onchange = Validate;

    resizeImage.onload = function () {
        maxWidth = this.width;
        maxHeight = this.height;
    }
    FilterToCookie();
})();
