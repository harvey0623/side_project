// $(function () {
    var $replyOuter = $('.replyOuter')
    var $replyBody = $('.replyBody')
    var $replyBtn = $('.replyBtn')
    var $leaveOuter = $('.leaveOuter')
    var $leaveBody = $('.leaveBody')
    var $leaveBtn = $('.leaveBtn')

    var $window = $(window)
    var moveTime = 50
    var addH = 60
    var once = true
    var tempPos     //暫存卷軸座標


    function init() {
        // $('.msgMenu').on('click', '.reply', showReply)  //顯示我要回覆
        $('.newMsg').on('click', showLeave)      //顯示新留言
        $('.replyBtn>.mycancel').on('click', hideReply)  //隱藏我要回覆
        $('.leaveBtn>.mycancel').on('click', hideLeave)  //隱藏留言
        $replyOuter.find('.reFill').on('click', emptyData1)  //清空資料
        $leaveOuter.find('.reFill').on('click', emptyData2)  //清空資料
        $(window).on('resize', adjustH)     //調整高度
        $(document).scroll(adjustH)
    }

    //算高度
    function countH() {
        once = true

        $replyBody.css({ height: $(window).height() - $('.replyHeader').innerHeight() })
        $leaveBody.css({ height: $(window).height() - $('.leaveHeader').innerHeight() })

        if ($('.replyMenu').innerHeight() + $replyBtn.innerHeight() > $replyBody.innerHeight()) {
            $replyBtn.css({ position: 'static' })
        } else {
            $replyBtn.css({ position: 'absolute', left: 0, bottom: 0 })
        }

        if ($('.leaveMenu').innerHeight() + $leaveBtn.innerHeight() > $leaveBody.innerHeight()) {
            $leaveBtn.css({ position: 'static' })
        } else {
            $leaveBtn.css({ position: 'absolute', left: 0, bottom: 0 })
        }

    }

    //顯示我要回覆
    // function showReply() {
    //     $replyOuter.show().animate({ top: 0 }, moveTime, function () {
    //         hideContent()
    //         $("#commenterName").focus()
    //     })
    // }

    //隱藏我要回覆
    function hideReply() {
        showConetnt()

        $replyOuter.animate({ top: '100%' }, moveTime, function () {
            $(this).hide()
            $(".content").show();
        })
    }

    //顯示新留言
    function showLeave() {
        $leaveOuter.show().animate({ top: 0 }, moveTime, function () {
            hideContent()
            $("#NcommenterName").focus();
        })
    }

    //隱藏留言
    function hideLeave() {
        showConetnt()

        $leaveOuter.animate({ top: '100%' }, moveTime, function () {
            $(this).hide()
            $(".content").show();
        })
    }

    //調整高度
    // function adjustH() {
    //     if (once) {
    //         $replyBody.css({ height: $replyBody.innerHeight() + addH })
    //         $leaveBody.css({ height: $leaveBody.innerHeight() + addH })
    //     }

    //     once = false
    // }
    function adjustH() {

            $replyBody.css({ height: window.screen.height })
            $leaveBody.css({ height: window.screen.height })
            countH()
    }

    //隱藏留言內容
    function hideContent() {
        tempPos = $(document).scrollTop()
        $('.content').hide()
        //countH()
        adjustH()
    }

    //顯示留言內容
    function showConetnt() {
        $('.content').show()
        $(document).scrollTop(tempPos)
    }

    //清空資料1
    function emptyData1() {
        $replyOuter.find('.form-control').each(function () {
            if (!$(this).prop('readonly')) {
                $(this).val("")
            }
        })
    }

    //清空資料2
    function emptyData2() {
        $leaveOuter.find('.form-control').each(function () {
            if (!$(this).prop('readonly')) {
                $(this).val("")
            }
        })
    }


    init()


// })