$(function () {
    var $myslick = $('.myslick')


    function init() {
        slickInit()

        $('.myhide').on('click', hideRemain)    //隱藏剩餘天數區塊
        $('.btn-string').on('click', editString)     //編輯文字
        $('.mysure').on('click', sendString)     //送出編輯文字
    }

    //slick啟動
    function slickInit() {
        $myslick.slick({
            infinite: true,
            autoplay: true,
            arrows: false
        })

        $('.prevSlick').on('click',function(){
            $myslick.slick('slickPrev')
        })

        $('.nextSlick').on('click',function(){
            $myslick.slick('slickNext')
        })

    }

    //隱藏剩餘天數區塊
    function hideRemain() {
        $('.remainBox').hide()
    }

    //編輯文字
    function editString() {
        $("#stringModal").modal("show")
    }

    //送出編輯文字
    function sendString() {
        $("#stringModal").modal("hide")
    }


    init()
})