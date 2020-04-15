$(function () {

    adjTitle()
    $('.collect').on('click', collecting)   //加入收藏
    $('.sortList>li').on('click', filtering)    //篩選


    //加入收藏
    function collecting() {
        var $a = $(this).parents('a')

        if ($a.hasClass('mycollect')) {
            $a.removeClass('mycollect')
            $(this).children('img').attr('src', './img/save_yes.png')
        } else {
            $a.addClass('mycollect')
            $(this).children('img').attr('src', './img/save_no.png')
        }
    }

    //篩選
    function filtering() {
        if ($(this).find('i').hasClass('myrotate') || $(this).find('img').hasClass('myrotate')) {
            $(this).find('i').removeClass('myrotate')
            $(this).find('img').removeClass('myrotate')
        } else {
            $(this).find('i').addClass('myrotate')
            $(this).find('img').addClass('myrotate')
        }
    }

    //調整title
    function adjTitle() {
        if ($(window).width() < 380 && ($('.maginify').css("display") == "block" || $('.totalMail').css('display') == 'block')) {
            $(".pageTitle").css("transform", "translate(-20%)")
        }

        if ($(window).width() < 380 && ($('.maginify').css("display") == "block" && $('.totalMail').css('display') == 'block')) {
            $(".pageTitle").css("transform", "translate(-40%)")
        }

    }


    //隱藏推播
    $('.cross').on('click', function () {
        $('.ad').hide()
    })
})