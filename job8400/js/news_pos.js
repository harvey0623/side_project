(function () {
    var filterMenu = document.querySelector('.filterMenu');
    var arrow_width = 30;  //箭頭寬度
    var $arrowBoxL = $('.arrowBoxL');
    var $arrowBoxR = $('.arrowBoxR');
    var step = 120;  //每次移動的距離(filterMenu>li的寬度)

    function init() {
        moveToTargetPos();
        $(filterMenu).on('scrollstop', { latency: 1 }, stopHandler);

        $('.arrowBoxL').on('click', function () {
            stepMove(-1);
        });

        $('.arrowBoxR').on('click', function () {
            stepMove(1);
        });
    }

    //將捲軸移動到對應的tab
    function moveToTargetPos() {
        var currentTab = filterMenu.querySelector('li.active');
        var posLeft = currentTab ? currentTab.offsetLeft : 0;
        filterMenu.scrollLeft = posLeft - arrow_width;
        //if ((posLeft - arrow_width) === 0) stopHandler();  //如果開始是零,就執行stopHandler
        stopHandler();
    }

    function stopHandler() {
        var scrollPos = filterMenu.scrollLeft;
        var finalPos = getDistance();
         console.log('stopHandler',scrollPos,finalPos,arrow_width);
        // if (scrollPos <= arrow_width) {
        //     $('.arrowBoxL').hide();
        // } else {
        //     $('.arrowBoxL').show();
        // }

        if (scrollPos <= arrow_width) {
            $arrowBoxL.hide();
        } else {
            $arrowBoxL.show();
        }

        if (scrollPos < finalPos) $arrowBoxR.show();
        if (scrollPos > arrow_width && scrollPos < finalPos) $('.arrowBox').show();
        if (scrollPos >= finalPos) $arrowBoxR.hide();

    }

    //取得捲軸總共要移動的距離
    function getDistance() {
        var view_width = filterMenu.clientWidth;
        var inner_width = filterMenu.scrollWidth;
        return inner_width - view_width;
    }

    function stepMove(num) {
        $(filterMenu).animate({
            scrollLeft: '+=' + (step * num)
        }, {
                duration: 300,
                easing: 'linear',
            });
    }

    init();


})();