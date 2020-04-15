$(function () {
    var $pageTitle = $('.pageTitle')
    var $addVancancy = $('.addVancancy')
    var $publishContent = $('.publishContent')
    var $final = $('.final')
    var $saveBox = $('.saveBox')
    var $dataMenu = $('.dataMenu')
    var $jobTitle = $('[name=jobTitle]')
    var $jobType = $('[name=jobType]')
    var $quota = $('[name=quota]')
    var $jobKind = $('[name=jobKind]')
    var $jobContent = $('[name=jobContent]')
    var $money = $('[name=money]')
    var $applyWay = $('[name=applyWay]')
    var $diploma = $('[name=diploma]')
    var $department = $('[name=department]')
    var $exp = $('[name=exp]')
    var $drive = $('[name=drive]')
    var $tool = $('[name=tool]')
    var $license = $('[name=license]')
    var $skill = $('[name=skill]')
    var $otherCondition = $('[name=otherCondition]')
    var $welfare = $('[name=welfare]')
    var $delModal = $('#delModal')
    var $workTime = $('[name=workTime]')

    var seekData
    var currentNum           //目前職缺編號     
    var maxVancancy = 5      //最多新增職缺數
    var maxLang = 7         //最多新增語言數
    var fadeTime = 10       //淡出入時間
    var publishObj = []    //所有刊登資訊
    var vacancyData = []    //刊登資料
    var delObj = {}   //移除職缺的資料


    function init() {
        runData()

        $addVancancy.on('click', '.vacancyFill', fillData)        //新增職缺資訊
        $addVancancy.on('click', '.delVacancy', showModal)    //顯示移除視窗
        $('.sureDel').on('click', removeVacancy)     //移除職缺資料
        $('.cancelDel').on('click', cancelRemove)    //取消移除職缺

        $('.langBox').on('click', '.delLang', removeLang)     //移除語言
        $('.plus>span').on('click', addVacancy)      //增加職缺 
        $('.clearData').on('click', reset)      //清除資料
        $('.dataTitle').children('span').on('click', showRequire)   //顯示條件選單
        $('.back').on('click', returnPage)      //回上一頁
        $('.plusLang>span').on('click', addLang)     //增加語言
        $saveBox.on('click', saveData)   //儲存職缺資料
        $('.final').on('click', sendData)    //送出資料
        $('.sureSave').on('click', hideModal)    //modal隱藏
    }

    function runData() {
        $.ajax({
            url: "js/data.json",
            dataType: "json",
            success: function (data) {
                seekData = data
            }
        })
    }

    //增加職缺
    function addVacancy() {
        var html = ""
        var total = $('.vacancyBox').length    //取得數量

        if (total < maxVancancy) {
            html += "<div class=\"vacancyBox\">"
            html += "<div class=\"delVacancy\">"
            html += "<i class=\"fa fa-trash\" aria-hidden=\"true\"></i>"
            html += "</div>"
            html += "<div class=\"vacancyFill\">"
            html += "<span>第 " + (total + 1) + " 個職缺</span>"
            html += "<i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i>"
            html += "</div>"
            html += "</div>"


            $addVancancy.append(html)
        }

    }

    //顯示移除視窗
    function showModal() {
        var $parent = $(this).parents('.vacancyBox')
        var num = $parent.index()

        if (num) {      //判斷是否為第一筆

            delObj = {     //取得刪除的資料
                parent: $parent,
                order: num
            }

            $delModal.modal("show")
        }
    }

    //移除職缺資料
    function removeVacancy() {
        vacancyData.splice(delObj.order, 1)     //移除資料
        delObj.parent.remove()  //移除ui

        $('.vacancyBox').each(function (index) {    //重新編號
            $(this).find('span').text("第 " + (index + 1) + " 個職缺")
        })

        console.log(vacancyData)
        dekObj = {}

        $delModal.modal("hide")

    }

    //取消移除職缺
    function cancelRemove() {
        $delModal.modal('hide')
    }

    //填寫和讀取職缺資訊
    function fillData() {
        currentNum = $(this).parents('.vacancyBox').index()    //取得職缺編號
        var targetData = vacancyData[currentNum]               //取得目標資料


        if (targetData) {       //判斷有無資料
            var jobInfo = targetData[0]
            var condition = targetData[1]
            var welfare = targetData[2]
            var html = ""
            var abilityData = [         //語言能力資料(跑回圈用)
                { eng: "listen", chi: '聽' },
                { eng: "speak", chi: '說' },
                { eng: "read", chi: '讀' },
                { eng: "write", chi: '寫' }
            ]


            /*====職缺資訊====*/

            $jobTitle.val(jobInfo.jobTitle)     //職務名稱
            $jobType.text(getDataArr(jobInfo.jobType, false, $jobType.parents('.fake')))    //職務類型
            $jobKind.text(getDataArr(jobInfo.jobKind, false, $jobKind.parents('.fake')))    //職務性質
            $jobContent.val(jobInfo.jobConetnt)     //工作內容
            $money.val(jobInfo.pay.money)           //新資
            $quota.val(jobInfo.quota)   //職缺名額
            $applyWay.text(getDataArr(jobInfo.applyWay, false, $applyWay.parents('fake')))      //應徵方式
            $workTime.text(getDataArr(jobInfo.workTime, false, $workTime.parents('.fake')))     // 工作時段



            $('.salary').children('label').each(function () {   //新資待遇
                var $radio = $(this).children('[type=radio]')
                if ($radio.val() == jobInfo.pay.method) {
                    $radio.prop('checked', true)
                    return false
                }
            })

            /*====徵才條件====*/

            $diploma.text(getDataArr(condition.diploma, false, $diploma.parents('.fake')))           //最高學歷
            $department.text(getDataArr(condition.department, false, $department.parents('.fake')))  //學歷科系
            $exp.text(getDataArr(condition.exp, false, $exp.parents('.fake')))      //工作經驗
            $drive.text(getDataArr(condition.drive, false, $drive.parents('.fake')))      //駕照
            $tool.text(getDataArr(condition.tool, false, $tool.parents('.fake')))      //擅長工具
            $license.val(condition.license)      //證照
            $skill.val(condition.skill)     //工作技能
            $otherCondition.val(condition.otherCondition)   //其他技能

            $('.supply').children('label').each(function () {       //補充條件
                var $checkbox = $(this).children('[type=checkbox]')

                if (condition.additional.indexOf($checkbox.val()) >= 0) {
                    $checkbox.prop('checked', true)
                } else {
                    $checkbox.prop('checked', false)
                }
            })


            /*======語言能力=====*/
            for (var b in condition.language) {
                html += "<div class=\"lang\">"
                html += "<label class=\"fake\">"
                html += "<div class=\"editorBox\">"
                html += "<span>外語能力</span>"
                html += "<i class=\"fa fa-trash delLang\" aria-hidden=\"true\"></i>"
                html += "</div>"
                html += "<div class=\"fakeSelect\" data-id=\"9\">"
                html += "<span name=\"word\"></span>"
                html += "<i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i>"
                html += "</div>"
                html += "</label>"

                for (var c in abilityData) {
                    html += "<label class=\"fake\">"
                    html += "<span>" + abilityData[c].chi + "</span>"
                    html += "<div class=\"fakeSelect\" data-id=\"12\">"
                    html += "<span name=\"" + abilityData[c].eng + "\"></span>"
                    html += "<i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i>"
                    html += "</div>"
                    html += "</label>"
                }

                html += "</div>"
            }

            $('.langBox').html(html)

            $('.lang').each(function (index) {
                var $this = $(this)
                var $word = $this.find("[name=word]")
                var $listen = $this.find("[name=listen]")
                var $speak = $this.find("[name=speak]")
                var $read = $this.find("[name=read]")
                var $write = $this.find("[name=write]")

                $word.text(getDataArr(condition.language[index].word, false, $word.parents(".fake")))            //語言
                $listen.text(getDataArr(condition.language[index].listen, false, $listen.parents(".fake")))      //聽
                $speak.text(getDataArr(condition.language[index].speak, false, $speak.parents(".fake")))         //說
                $read.text(getDataArr(condition.language[index].read, false, $read.parents(".fake")))            //讀
                $write.text(getDataArr(condition.language[index].write, false, $write.parents(".fake")))         //寫
            })


            /*====福利制度====*/
            $welfare.text(getDataArr(welfare.item, true, $welfare.parents('.fake')))


            $(".fakeSelect").off("click").on("click", showTypeBox)


        } else {
            $('.lang').slice(1).remove()     //預設1個語言
            clearDataMenu()
        }


        $('.dataTitle').each(function () {          //關掉展開的選單
            var $span = $(this).children('span')
            if ($span.hasClass('noBor')) {
                $span.click()
            }
        })

        $pageTitle.text("第" + (currentNum + 1) + "個職缺")
        $publishContent.add($final).hide()
        $dataMenu.add($saveBox).show()
    }

    //顯示條件選單
    function showRequire() {
        var $this = $(this)
        var $li = $this.parents('li')

        if ($this.hasClass('noBor')) {
            $this.removeClass('noBor').children('i').removeClass('myrotate')
            $this.parent().removeClass('myfocus').next().fadeOut(fadeTime, reSite)
        } else {
            $this.addClass('noBor').children('i').addClass('myrotate')
            $this.parent().addClass('myfocus').next().fadeIn(fadeTime, reSite)

            $li.siblings().children('.dataTitle').removeClass('myfocus')
            $li.siblings().children('.dataTitle').children('span').removeClass('noBor')
            $li.siblings().children('.dataTitle').find('i').removeClass('myrotate')
            $li.siblings().children('form').fadeOut(fadeTime, reSite)
        }


        function reSite() {
            var windowH = $(window).height()
            var bodyP = Number($('body').css('paddingTop').replace('px', ""))
            var contentH = $('.content').innerHeight()
            var saveBoxH = $saveBox.innerHeight()

            $(document).scrollTop(0)

            if (bodyP + contentH + saveBoxH >= windowH) {
                $saveBox.css({ position: 'static' })
            } else {
                $saveBox.css({ position: 'fixed' })
            }
        }
    }

    //回上一頁
    function returnPage(e) {
        if ($publishContent.css('display') == 'none') {
            e.preventDefault()
            $publishContent.add($final).show()
            $dataMenu.add($saveBox).hide()
            $pageTitle.text('職缺刊登')
        }
    }

    //增加語言
    function addLang() {
        var total = $('.lang').length

        if (total < maxLang) {
            var $cloneLang = $('.lang').slice(0, 1).clone(true)
            $cloneLang.children(['data-result']).removeAttr('data-result')
            $cloneLang.find('.fakeSelect').children('span').text('請選擇')
            $('.langBox').append($cloneLang)
        }
    }

    //移除語言
    function removeLang() {
        $(this).parents('.lang').remove()
    }

    //清除資料
    function reset() {
        if ($publishContent.css('display') == 'block') {
            $publishContent.find('[type=checkbox]').prop('checked', false)
            $publishContent.find('input').val('')
            $publishContent.find('select').each(function () {
                $(this).children('option').eq(0).prop('selected', true)
            })
        } else {
            clearDataMenu()
        }
    }

    //清除dataMenu資料
    function clearDataMenu() {
        $dataMenu.find('.form-control').val("")
        $dataMenu.find('[type=checkbox]').prop('checked', false)
        $dataMenu.find('[type=radio]').prop('checked', false)
        $dataMenu.find('.fakeSelect').children('span').text("請選擇")
        $dataMenu.find('[data-result]').removeAttr('data-result')
    }

    //儲存職缺資料
    function saveData() {
        var criteriaData = []     //條件資料
        var jobInfo = {}        //職缺資訊
        var condition = {}      //徵才條件
        var welfare = {}        //福利
        var salaryWay           //付薪方式
        var addData = []        //補充條件
        var langData = []       //語言資料

        /*=======職缺資訊=======*/

        $('.salary').children('label').each(function () {   //取得付薪方式
            var $radio = $(this).children('[type=radio]')
            if ($radio.prop('checked')) {
                salaryWay = $radio.val()
                return false
            } else {
                salaryWay = ""
            }
        })


        jobInfo = {
            jobTitle: $jobTitle.val(),   //職務名稱

            jobType: getOptionId($jobType.parents('.fake').attr('data-result')),
            quota: $quota.val(),         //職缺名額
            jobKind: getOptionId($jobKind.parents('.fake').attr('data-result')),
            jobConetnt: $jobContent.val(),      //工作內容
            pay: {
                method: salaryWay,      //付薪方式
                money: $money.val()      //薪資
            },
            applyWay: getOptionId($applyWay.parents('.fake').attr('data-result')),      //應徵方式
            workTime: getOptionId($workTime.parents('.fake').attr('data-result'))       //工作時段
        }


        /*=====徵才條件======*/

        $('.supply').children('label').each(function () {     //取得補充條件
            var $checkbox = $(this).children('[type=checkbox]')
            if ($checkbox.prop('checked')) {
                addData.push($checkbox.val())
            }
        })


        $('.lang').each(function () {   //取得語言能力
            var $this = $(this)
            var langObj = {}

            langObj = {
                word: getOptionId($this.find('[name=word]').parents('.fake').attr('data-result')),         //語言
                listen: getOptionId($this.find('[name=listen]').parents('.fake').attr('data-result')),     //聽
                speak: getOptionId($this.find('[name=speak]').parents('.fake').attr('data-result')),       //說
                read: getOptionId($this.find('[name=read]').parents('.fake').attr('data-result')),         //讀
                write: getOptionId($this.find('[name=write]').parents('.fake').attr('data-result'))        //寫
            }

            langData.push(langObj)
        })


        condition = {
            diploma: getOptionId($diploma.parents('.fake').attr('data-result')),          //學歷
            department: getOptionId($department.parents('.fake').attr('data-result')),    //科系
            exp: getOptionId($exp.parents('.fake').attr('data-result')),                  //經驗
            drive: getOptionId($drive.parents('.fake').attr('data-result')),              //駕照
            tool: getOptionId($tool.parents('.fake').attr('data-result')),                //擅長工具
            additional: addData,                //補充條件
            license: $license.val(),            //證照   
            skill: $skill.val(),                //工作技能
            otherCondition: $otherCondition.val(),    //其他條件
            language: langData   //語言能力
        }


        /*======福利制度=====*/
        welfare = {
            item: getOptionId($welfare.parents('.fake').attr('data-result'))    //福利制度
        }


        criteriaData.push(jobInfo, condition, welfare)
        vacancyData[currentNum] = criteriaData
        console.log(vacancyData)

        sureModal()

    }

    //取得選項id
    function getOptionId(selectId) {
        if (selectId) {
            var n
            n = selectId.split(",")
            n = n.map(function (d) {
                return d = +d
            })

            return n
        } else {
            return []
        }
    }

    //取得項目名稱
    function getOptionName(arr, empty) {        //arr代表傳入id陣列,empty代表是要傳空字串還是其他字串
        if (arr.length == 0 && empty == true) {
            return ""
        } else if (arr.length == 0 && empty == false) {
            return "請選擇"
        } else {
            var txt = []

            for (var a of seekData) {
                for (var b of a.list) {
                    if (arr.indexOf(b.mainId) >= 0) {
                        txt.push(b.name)
                    }
                }
            }

            return txt.join("、")
        }
    }

    //取的標籤上的data-*屬性
    function getDataArr(arr, empty, fake) {     //arr代表傳入id陣列,empty代表是要傳空字串還是其他字串,fake代表data-result要放置的tag
        if (arr.length == 0) {
            fake.removeAttr("data-result")
        } else {
            fake.attr("data-result", arr.join(","))
        }

        return getOptionName(arr, empty)

    }

    //送出資料
    function sendData() {
        var methodData = []     //刊登方式

        $('.sendMethod').children('label').each(function () {
            var $checkbox = $(this).children('[type=checkbox]')
            if ($checkbox.prop('checked')) {
                methodData.push($checkbox.val())
            }
        })


        if (vacancyData.length) {
            filterData()
        }

        publishObj = {
            incName: {
                name: $('[name=incName]').val(),   //公司名稱
                hide: $('[name=hideName]').prop('checked')   //是否顯示公司名稱
            },
            worksite: {
                city: $('[name=city]').val(),   //城市
                district: $('[name=district]').val(),   //區
                addr: $('[name=addr]').val(),     //地址
                hide: $('[name=hideAddr]').prop('checked')   //是否顯示上班地點
            },
            tel: $('[name=tel]').val(),   //連絡電話
            contactor: $('[name=contactor]').val(),   //連絡人
            phone: $('[name=phone]').val(),   //手機號碼
            remark: $('[name=remark]').val(),     //備註
            type: methodData,     //刊登種類
            publishDay: $('[name=publishDay]').val(),    //刊登天數
            vacancy: vacancyData     //職缺資料
        }

        console.log(publishObj)

        //篩選掉undefined的元素
        function filterData() {
            for (var d = 0; d < vacancyData.length; d++) {
                if (!vacancyData[d]) {
                    vacancyData.splice(d, 1)
                    filterData()
                }
            }
        }


    }

    //儲存成功modal出現
    function sureModal() {
        $('#saveModal').modal('show')
        $('.back').click()
        $(document).scrollTop(0)
    }

    //隱藏modal
    function hideModal() {
        $('#saveModal').modal('hide')
    }


    init()

})