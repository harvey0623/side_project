$(function () {
    var $methodBox = $('.methodBox')
    var $infoBox = $('.infoBox')
    var $btnBox = $('.btnBox')
    var $wireFill = $('.wireFill')
    var $atmFill = $('.atmFill')
    var $yes = $('.yes')
    var $dayFill = $('.dayFill')
    var fadeTime = 10

    function init() {
        judgeFill()  //判斷是否要顯示填寫內容

        $('.firstPublish').find('[type=radio]').on('click', showFill)    //顯示填寫欄位
        $('.clearData').on('click', emptyData)   //清空資料
        $methodBox.find('[type=radio]').on('click', choosePay)  //選擇付款方式 
        // $dayFill.on('focus', cancelOther)   //取消其他選擇
        $('.surePublish').on('click', fillContent)   //填寫內容
        $('.sureFill').on('click', noFill)   //未填寫確認
    }

    //判斷是否要顯示填寫內容
    function judgeFill() {
        if ($yes.prop('checked')) {
            $infoBox.show()
            $btnBox.css({ position: 'static' })
        } else {
            $infoBox.hide()
            $btnBox.css({ position: 'fixed' })
        }
    }

    //顯示填寫欄位
    function showFill() {
        if ($(this).is('.yes')) {
            $infoBox.fadeIn(fadeTime, function () {
                $btnBox.css({ position: 'static' })
            })
        } else {
            $infoBox.fadeOut(fadeTime, function () {
                $btnBox.css({ position: 'fixed' })
            })
        }
    }

    //清空資料
    function emptyData() {
        $('input').val("")
        $('select').children('option').eq(0).prop('seleect', true)
        $methodBox.find('[type=radio]').prop('checked', false)
        $wireFill.add($atmFill).prop('readonly', true)
    }

    //選擇付款方式 
    function choosePay() {
        if ($(this).is('.wirePay')) {
            $wireFill.prop('readonly', false)
            $atmFill.val('').prop('readonly', true)
        } else if ($(this).is('.atmPay')) {
            $wireFill.val('').prop('readonly', true)
            $atmFill.prop('readonly', false)
        } else {
            $wireFill.add($atmFill).val('').prop('readonly', true)
        }
    }

    //取消其他選擇
    function cancelOther() {
        $methodBox.find('[type=radio]').prop('checked', false)
        $wireFill.add($atmFill).val('').prop('readonly', true)
    }

    //填寫內容
    function fillContent() {
        var publishObj = {}  //刊登資料
        var stop = false
        var coor = []

        if (!$('.no').prop('checked')) {

            $('.should').each(function () {     //判斷必填欄位
                var $this = $(this)
                var num

                if ($this.val() == "") {

                    if ($this.prev().is('span')) {      //判斷要取誰的座標
                        num = $this.prev().offset().top
                    } else {
                        num = $this.offset().top
                    }

                    coor.push(num)

                    $this.next().show()
                    $("#noFill").modal("show")

                    stop = true
                } else {
                    $this.next().hide()
                }
            })


            if (coor.length != 0) {
                coor = coor.sort(function (a, b) {  //對做標進行排序(小到大)
                    return a - b
                })

                $(window).scrollTop(coor[0] - 60)
            }

        }


        if (!stop) {
            publishObj.publishName = $('[name=publishName]').val()     //刊登人姓名
            publishObj.publishPhone = $('[name=publishPhone]').val()    //刊登人電話

            if ($yes.prop('checked')) {        //判斷是否為第一次刊登
                publishObj.incName = $('[name=incName]').val()    //公司名稱
                publishObj.contactor = $('[name=contactor]').val()      //公司聯絡人
                publishObj.contactorP = $('[name=contactorP]').val()      //公司聯絡人
                publishObj.incTel = $('[name=incTel]').val()      //公司聯絡人電話
                publishObj.ext = $('[name=ext]').val()          //分機號碼
                publishObj.incPhone = $('[name=incPhone]').val()    //公司聯絡人手機
                publishObj.fax = $('[name=fax]').val()    //傳真
                publishObj.code = $('[name=code]').val()  //統一編號
                publishObj.mail = $('[name=mail]').val()  //信箱
                publishObj.site = {
                    city: $('[name=city]').val(),    //城市
                    district: $('[name=district]').val(),    //區域
                    address: $('[name=address]').val()   //地址 
                }
                publishObj.payDay = $dayFill.val()  //月結日期

                publishObj.way = ""


                if ($('.direct').prop('checked')) {     //直接收現
                    publishObj.way = $('.direct').val()
                }

                if ($('.wirePay').prop('checked')) {     //電匯
                    publishObj.way = $wireFill.val()
                }

                if ($('.atmPay').prop('checked')) {     //atm
                    publishObj.way = $atmFill.val()
                }

                if ($('.storePay').prop('checked')) {     //超商繳費
                    publishObj.way = $('.storePay').val()
                }

                if ($('.postPay').prop('checked')) {     //回郵
                    publishObj.way = $('.postPay').val()
                }
            }

            console.log(publishObj)

        }


    }

    //位填寫內容
    function noFill() {
        $("#noFill").modal("hide");
    }



    init()

})