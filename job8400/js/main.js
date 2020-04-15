$(function () {
    var $menuOuter = $('.menuOuter')
    var $memberOuter = $('.memberOuter')
    var $shareOuter = $('.shareOuter')
    var $cover = $('.cover')
    var $maginify = $('.maginify')
    var $seekPanel = $('.seekPanel')
    var isOpen = false
    var runTime = 200
    var scrollPos = 0;

    function init() {
        adjustMaginify()  //調整放大鏡位置

        $('.menuSwitch').on('click', toggleMenu)    //側選單開關
        $cover.on('click', hideAllMenu)             //隱藏所有選單
        $('.member').on('click', showmemberMenu)    //顯示會員選單
        $('.share').on('click', showShareMenu)      //顯示分享選單
        $('.returnIcon').on('click', returnBack)    //返回主選單

        $maginify.on('click', showSeekPanel)            //顯示搜尋面板
        $('.signOut').on('click', factorSignOut)        //廠商登出
        $('.hideSignOut').on('click', cancelSignOut)    //廠商取消登出
        $('.seekListBack').on('click', hideSeekPanel)   //隱藏搜尋面板
    }

    //側選單開關
    function toggleMenu() {
        if (!isOpen) {
            $cover.fadeIn(runTime)
            $menuOuter.addClass('open');
        } else {
            $cover.fadeOut(runTime)
            $menuOuter.removeClass('open')
            returnBack()
        }
        isOpen = !isOpen;
    }

    //顯示次選單
    function showmemberMenu() {
        $memberOuter.addClass('open');
    }

    //顯示分享選單
    function showShareMenu() {
        $shareOuter.addClass('open');
    }

    //返回主選單
    function returnBack() {
        $memberOuter.removeClass('open');
        $shareOuter.removeClass('open');
    }

    //隱藏所有選單
    function hideAllMenu() {
        isOpen = false;
        $cover.fadeOut(runTime)
        $('.menuOuter, .memberOuter, .shareOuter').removeClass('open');
    }

    //顯示搜尋面板
    function showSeekPanel() {
        $seekPanel.addClass('open');
        scrollPos = $(document).scrollTop()
        $(window).on('scroll', stopScroll)
    }

    //隱藏搜尋面板
    function hideSeekPanel() {
        $seekPanel.removeClass('open')
        $(window).off('scroll')
    }

    //停止卷軸捲動
    function stopScroll() {
        if ($(this).scrollTop() != scrollPos) $(document).scrollTop(scrollPos);
    }

    //廠商登出
    function factorSignOut() {
        $("#signOutModal").modal("show")
    }

    //廠商取消登出
    function cancelSignOut() {
        $("#signOutModal").modal("hide")
    }

    //放大鏡位置調整
    function adjustMaginify() {
        if ($('.totalMail').css('display') == 'block') {
            $maginify.css({ marginRight: 10 })
        } else {
            $maginify.css({ marginRight: 15 })
        }
    }

    init()
})