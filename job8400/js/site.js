window.onload = function () {
    var $btnBox = $('.btnBox')

    adjustSite()

    $(window).on('resize', function () {
        adjustSite()
    })

    //調整位置
    function adjustSite() {
        var bodyPadding = Number($('body').css('paddingTop').replace('px', ''))
        var contentH = $('.content').innerHeight()
        var btnBoxH = $btnBox.innerHeight()
        var windowH = $(window).height()


        if (bodyPadding + contentH + btnBoxH >= windowH) {
            $btnBox.css({ position: 'static' })
        } else {
            $btnBox.css({ position: 'fixed' })
        }
    }

}
