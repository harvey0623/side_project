$(function () {
    var $aboutBtn = $('.aboutBtn')
    var $criteriaBtn = $('.criteriaBtn')
    var $previewWrap = $('.previewWrap')
    var $lockWrap = $('.lockWrap')
    var $myName = $('[name=myname]')
    var $gender = $('[name=gender]')
    var $city = $('[name=city]')
    var $district = $('[name=district]')
    var $phone = $('[name=phone]')
    var $tel = $('[name=tel]')
    var $mail = $('[name=mail]')
    var $tdName = $('[name=tdName]')
    var $diploma = $('[name=diploma]')
    var $schoolName = $('[name=schoolName]')
    var $studyKind = $('[name=studyKind]')
    var $department = $('[name=department]')
    var $exp = $('[name=exp]')
    var $position = $('[name=position]')
    var $jobType = $('[name=jobType]')
    var $period = $('[name=period]')
    var $stayCompany = $('.stayCompany')
    var $region = $('[name=region]')
    var $wantPay = $('[name=wantPay]')
    var $drive = $('[name=drive]')
    var $tool = $('[name=tool]')
    var $license = $('[name=license]')
    var $technic = $('[name=technic]')
    var $myLang = $('.myLang')
    var $about = $('[name=about]')
    var $yearList = $('[name=yearList]')
    var $monthList = $('[name=monthList]')

    var fuse = true
    var windowH = $(window).height()
    var moveHeaderH = $('.moveHeader').innerHeight()
    var remainH = windowH - moveHeaderH
    var runTime = 150
    var who         //是哪一個返回選單
    var doing = false   //判斷是否要執行選單動畫
    var resumeData
    var me
    var diploma
    var standard
    var skill
    var article


    function init() {
        makeCalender()
        runData()

        $('.profileBox,.personBox,.aboutBox,.criteriaBox,.skillBox,.expBox,.previewBox,.lockBox').css({ height: remainH })
        adjustButton()   //調整按鈕位置

        $('.meSure').on('click', storeMe)   //儲存個人資料
        $('.studySure').on('click', storeStudy)  //儲存學經歷
        $('.standardSure').on('click', storeStandard)    //儲存條件
        $('.skillSure').on('click', storeSkill)  //儲存技能專長
        $('.aboutSure').on('click', storeAbout)      //儲存自傳

        $('.profileList').children('li').on('click', matchData)         //顯示對應個人資料
        $('.goBack').on('click', backProfile)     //返回簡介
        $('.switchBtn').on('click', openStatus)     //開關履歷狀態
        $('.resetData').on('click', rewriteData)     //重寫資料
        $('.newWork').children('span').on('click', addWork)      //新增工作經驗
        $('.newLang').children('span').on('click', addLang)     //新增語言
        $('.btn-prev').on('click', previewResume)    //預覽履歷
        $('.goPrev').on('click', returnProfile)  //返回簡介
        $('.btn-lock').on('click', watchLock)   //顯示封鎖
        $('.goPrev2').on('click', returnProfile2)  //返回簡介
        $stayCompany.on('click', '.delExp', removeExp)   //刪除工作經驗
        $myLang.on('click', '.delLang', removeLang)   //移除語言
        $('.meCancel,.studyCancel,.standardCancel,.skillCancel,.aboutCancel').on('click', backProfile)   //返回簡介
        $('.sureSave').on('click', hideModal)    //modal隱藏
        $('.aboutList>li').on('click', showDemo)     //顯示履歷範例

        // $('header,.profileBox').animate({ left: '-100%' }, runTime)
        // $('.criteriaWrap').animate({ left: 0 }, runTime, function () {
        //     $(this).css({ position: "absolute" })
        // })
    }

    //跑資料
    function runData() {
        resumeData = {
            "me": {
                "name": "Harvey",
                "identity": [
                    "新住民",
                    "身心障礙"
                ],
                "gender": "女",
                "birth": "2017-10-10",
                "age": 25,
                "site": {
                    "city": "台北市",
                    "district": "中正區"
                },
                "phone": 123456789,
                "tel": 123456789,
                "mail": "test@gmail.com"
            },
            "diploma": {
                "studyHeight": "大學",
                "schoolName": "",
                "studyKind": "教育學科類",
                "department": "教育系",
                "exp": "不拘",
                "position": "作業員",
                "jobType": "全職",
                "workExp": [
                    {
                        "incName": "aaa",
                        "hide": false,
                        "jobKind": "作業員",
                        "isStay": false,
                        "startTime": "2000-01-01",
                        "endTime": "2017-01-01",
                        "jobContent": "好累"
                    },
                    {
                        "incName": "bbb",
                        "hide": true,
                        "jobKind": "作業員",
                        "isStay": true,
                        "startTime": "2000-10-10",
                        "endTime": "",
                        "jobContent": "好煩"
                    }
                ]
            },
            "standard": {
                "region": "彰化市",
                "period": "早班",
                "hope": {
                    "rule": "面議",
                    "bottomMoney": 35000,
                    "topMoney": 40000
                }
            },
            "skill": {
                "drive": "輕型機車",
                "tool": "Excel、Word",
                "license": "潛水員證照",
                "technic": "coding",
                "language": [
                    {
                        "word": "英文",
                        "listen": "略懂",
                        "speak": "略懂",
                        "read": "",
                        "write": "略懂"
                    },
                    {
                        "word": "日本",
                        "listen": "略懂",
                        "speak": "略懂",
                        "read": "略懂",
                        "write": "精通"
                    }
                ]
            },
            "article": "期照現是親深格精能腦我以失格臺代食油切人快手"
        }

        me = resumeData.me      //個人資料
        diploma = resumeData.diploma  //學經歷
        standard = resumeData.standard  //求才條件
        skill = resumeData.skill    //技能專長
        article = resumeData.article    //自傳

        $('.profileList').children('li').each(function () {     //自動填寫履歷
            $(this).click()
        })

        doing = true
    }

    //產生年月
    function makeCalender() {
        var htmlYear = ""
        var htmlMonth = ""
        var min = 70    //最大年記
        var nowYear = new Date().getFullYear()

        for (var i = nowYear; i >= nowYear - min; i--) {
            htmlYear += '<option value="' + i + '">' + i + '</option>'
        }

        for (var i = 1; i <= 12; i++) {
            htmlMonth += '<option value="' + i + '">' + i + '</option>'
        }

        $yearList.html(htmlYear)
        $monthList.html(htmlMonth)

    }

    //顯示對應個人資料
    function matchData() {
        var html = ""
        var string = ""
        who = '.' + $(this).attr('data-object')     //取得對應目標

        switch (who) {
            case '.personWrap':
                //判斷是否為第一次填履歷
                if (me.name != undefined) {     
                    $myName.val(me.name)    //姓名
                    
                    $('.identity').children('label').each(function () {     //身分
                        var $checkbox = $(this).children('[type=checkbox]')
                        if (me.identity.indexOf($checkbox.val()) >= 0) {
                            $checkbox.prop('checked', true)
                        }
                    })

                    $gender.val(me.gender)  //性別

                    $yearList.children('option').each(function () {   //出生年
                        if ($(this).val() == me.birth.year) {
                            $(this).prop('selected', true)
                        }
                    })

                    $monthList.children('option').each(function () {  //出生月
                        if ($(this).val() == me.birth.month) {
                            $(this).prop('selected', true)
                        }
                    })

                    $city.val(me.site.city)     //城市
                    $district.val(me.site.district)     //區域
                    $phone.val(me.phone)    //手機
                    $tel.val(me.tel)    //連絡市話
                    $mail.val(me.mail)  //信箱

                    if (!doing) $('.meSure').click()
                }

                break

            case '.expWrap':
                if (diploma.studyHeight != undefined) {     //判斷是否為第一次填履歷
                    $diploma.text(diploma.studyHeight != "" ? diploma.studyHeight : "請選擇")  //最高學歷
                    $schoolName.val(diploma.schoolName)     //學校
                    $studyKind.text(diploma.studyKind != "" ? diploma.studyKind : "請選擇")  //學科系類別
                    $department.val(diploma.department)     //科系
                    $exp.text(diploma.exp)      //工作經驗
                    $position.text(diploma.position)    //希望職務
                    $jobType.text(diploma.jobType)  //職務性質

                    for (var g in diploma.workExp) {    //工作經驗
                        html += '<div class="workExp">'
                            html += '<label>'
                            html += '<div class="editorBox">'
                            html += '<span>公司名稱</span>'
                            html += '<i class="fa fa-trash delExp" aria-hidden="true"></i>'
                            html += '</div>'
                            html += '<input type="text" class="form-control" name="incName" placeholder="請輸入公司名稱">'
                            html += '<label>'
                            html += '<input type="checkbox" class="hide_inc">'
                            html += '<span>不顯示</span>'
                            html += '</label>'
                            html += "</label>"

                            html += '<label>'
                            html += '<span>職務類型</span>'
                            html += '<div class="fakeSelect" data-id="1">'
                            html += '<span name="jobKind">' + (diploma.workExp[g].jobKind != "" ? diploma.workExp[g].jobKind : '請選擇') + '</span>'
                            html += '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
                            html += '</div>'
                            html += '</label>'

                            html += '<label for="">'
                            html += '<span>任職期間</span>'
                            html += '<input type="checkbox" class="stay_work">'
                            html += '<span>乃在職</span>'

                            html += '<div class="hasArrow">'
                            html += '<input type="date" class="form-control" name="startTime">'
                            // html += '<span><i class="fa fa-chevron-down" aria-hidden="true"></i></span>'
                            html += '</div>'
                            html += '</label>'

                            html += '<label>'
                            html += '<span>至</span>'
                            html += '<div class="hasArrow">'
                            html += '<input type="date" class="form-control" name="endTime">'
                            // html += '<span><i class="fa fa-chevron-down" aria-hidden="true"></i></span>'
                            html += '</div>'
                            html += '</label>'

                            html += '<label>'
                            html += '<span>工作內容</span>'
                            html += '<textarea class="form-control" name="jobContent"></textarea>'
                            html += '</label>'

                        html += '</div>'
                    }

                    $stayCompany.html(html)

                    $('.workExp').each(function (index) {
                        $(this).find('[name=incName]').val(diploma.workExp[index].incName)
                        $(this).find('.hide_inc').prop('checked', diploma.workExp[index].hide)
                        $(this).find('[name=startTime]').val(diploma.workExp[index].startTime)
                        $(this).find('[name=endTime]').val(diploma.workExp[index].endTime)
                        $(this).find('[name=jobContent]').val(diploma.workExp[index].jobContent)
                        $(this).find('.stay_work').prop('checked', diploma.workExp[index].isStay)

                        //如果目前乃在職就disable離職時間
                        if (diploma.workExp[index].isStay) {
                            $(this).find('[name=endTime]').prop('disabled', true)
                        }
                    })

                    //綁定事件
                    $('.stay_work').on('change', function() {
                        var isChecked = $(this).prop('checked');
                        var parents = $(this).parents('.workExp');

                        if (isChecked) {
                            parents.find('[name=endTime]').val('').prop('disabled', true);
                        } else {
                            parents.find('[name=endTime]').val('').prop('disabled', false);
                        }
                    })

                    if (!doing) $('.studySure').click()
                }

                break

            case '.criteriaWrap':
                //判斷是否為第一次填履歷
                if (standard.region != undefined) {     
                    $region.text(standard.region)   //希望地區
                    $period.text(standard.period != "" ? standard.period : '請選擇')   //上班時段

                    $('.expect').children('label').each(function () {   //期望待遇
                        var $radio = $(this).children('[type=radio]')
                        if ($radio.val() == standard.hope.rule) {
                            $radio.prop('checked', true)
                        } else {
                            $radio.prop('checked', false)
                        }
                    })

                    $('[name=bottomMoney]').val(standard.hope.bottomMoney)
                    $('[name=topMoney]').val(standard.hope.topMoney)

                    if (!doing) $('.standardSure').click()
                }

                break

            case '.skillWrap':
                //判斷是否為第一次填履歷
                if (skill.drive != undefined) {    
                    $drive.text(skill.drive)    //駕照
                    $tool.text(skill.tool)  //擅長工具
                    $license.val(skill.license) //證照
                    $technic.val(skill.technic) //工作技能

                    var abilityData = [   //語言程度
                        { eng: "listen", chi: "聽" },
                        { eng: "speak", chi: "說" },
                        { eng: "read", chi: "讀" },
                        { eng: "write", chi: "寫" }
                    ]

                    for (var h in skill.language) {     //語言
                        string += '<div class="lang">'
                        string += '<label>'
                        string += '<div class="editorBox">'
                        string += '<span>外語能力</span>'
                        string += '<i class="fa fa-trash delLang" aria-hidden="true"></i>'
                        string += '</div>'
                        string += '<div class="fakeSelect" data-id="9">'
                        string += '<span name="word">' + (skill.language[h].word != "" ? skill.language[h].word : '請選擇') + '</span>'
                        string += '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
                        string += '</div>'
                        string += '</label>'

                        for (var j in abilityData) {
                            string += '<label>'
                            string += '<span>' + abilityData[j].chi + '</span>'
                            string += '<div class="fakeSelect" data-id="12">'
                            string += "<span name=\"" + abilityData[j].eng + "\">" + (skill.language[h][abilityData[j].eng] != "" ? skill.language[h][abilityData[j].eng] : '請選擇') + "</span>"
                            string += '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
                            string += '</div>'
                            string += '</label>'
                        }

                        string += '</div>'
                    }

                    $('.myLang').html(string)

                    $(".lang").each(function (index) {
                        var $this = $(this)
                        var $word = $this.find("[name=word]")
                        var $listen = $this.find("[name=listen]")
                        var $speak = $this.find("[name=speak]")
                        var $read = $this.find("[name=read]")
                        var $write = $this.find("[name=write]")

                        $word.text(getDataArr(skill.language[index].word, false, $word.parents(".fake")))            //語言
                        $listen.text(getDataArr(skill.language[index].listen, false, $listen.parents(".fake")))      //聽
                        $speak.text(getDataArr(skill.language[index].speak, false, $speak.parents(".fake")))         //說
                        $read.text(getDataArr(skill.language[index].read, false, $read.parents(".fake")))            //讀
                        $write.text(getDataArr(skill.language[index].write, false, $write.parents(".fake")))         //寫
                    })

                    if (!doing) $('.skillSure').click()
                }

                break

            case '.aboutWrap':
                //判斷是否有填自傳
                if (article != "") {    
                    $about.val(article)
                    if (!doing) $('.aboutSure').click()
                }

                break
        }


        $(".fakeSelect").off("click").on("click", showTypeBox)
        $('.should').next().hide()      //隱藏所有警示語

        if (doing) {
            $('header,.profileBox').animate({ left: '-100%' }, runTime)
            $(who).animate({ left: 0 }, runTime, function () {
                $(this).css({ position: "absolute" })
            })
        }

    }

    //返回簡介
    function backProfile() {
        $('header,.profileBox').animate({ left: 0 }, runTime)
        $(who).css({ position: "fixed" }).animate({ left: '100%' }, runTime)
    }

    //履歷狀態
    function openStatus() {
        if (fuse) {
            $(this).addClass('myon').children('span').addClass('mymove')
        } else {
            $(this).removeClass('myon').children('span').removeClass('mymove')
        }

        fuse = !fuse
    }

    //重寫資料
    function rewriteData() {
        $(who).find('.form-control').val('')
        $(who).find('[type=checkbox]').prop('checked', false)
        $(who).find('[type=radio]').prop('checked', false)
        $(who).find('.fakeSelect').children('span').text("請選擇")
        $(who).find('select').each(function () {
            $(this).children('option').eq(0).prop('selected', true)
        })
    }

    //調整按鈕位置
    function adjustButton() {
        if ($('.aboutOuter').innerHeight() + $aboutBtn.innerHeight() <= $('.aboutBox').innerHeight()) {
            $aboutBtn.css({ position: 'absolute', left: 0, bottom: 0 })
        } else {
            $aboutBtn.css({ position: 'static' })
        }

        if ($('.criteria').innerHeight() + $criteriaBtn.innerHeight() <= $('.criteriaBox').innerHeight()) {
            $criteriaBtn.css({ position: 'absolute', left: 0, bottom: 0 })
        } else {
            $criteriaBtn.css({ position: 'static' })
        }

    }

    //新增語言
    function addLang() {
        var $clone = $('.lang').slice(0, 1).clone(true)
        $clone.find('.fakeSelect').children('span').text('請選擇')
        $clone.find('[data-result]').removeAttr('data-result')
        $myLang.append($clone)
    }

    //刪除語言
    function removeLang() {
        $(this).parents('.lang').remove()
    }

    //新增工作經驗
    function addWork() {
        var $clone = $('.workExp').slice(0, 1).clone(true)
        $clone.find('.fakeSelect').children('span').text('請選擇')
        $clone.find('.form-control').val('')
        $clone.find('[type=checkbox]').prop('checked', false)
        $clone.find('[data-result]').removeAttr('data-result')
        $('.stayCompany').append($clone)
    }

    //刪除工作經驗
    function removeExp() {
        $(this).parents('.workExp').remove()
    }

    //預覽履歷
    function previewResume() {
        $('header,.profileBox').animate({ left: '-100%' }, runTime)
        $previewWrap.animate({ left: 0 }, runTime)
    }

    //返回簡介
    function returnProfile() {
        $('header,.profileBox').animate({ left: 0 }, runTime)
        $previewWrap.animate({ left: '100%' }, runTime)
    }

    //顯示封鎖
    function watchLock() {
        $('header,.profileBox').animate({ left: '-100%' }, runTime)
        $lockWrap.animate({ left: 0 }, runTime, function () {
            $(this).css({ position: "absolute" })
        })
    }

    //返回簡介2
    function returnProfile2() {
        $('header,.profileBox').animate({ left: 0 }, runTime)
        $lockWrap.css({ position: "fixed" }).animate({ left: '100%' }, runTime)
    }

    //儲存個人資料
    function storeMe() {
        var $should = $('.personBox').find('.should')
        var stop = false
        var identityData = [] //身分資料

        $should.each(function () {      //判斷必填欄位有無填寫
            if ($(this).val() == "") {
                $(this).next().show()
                stop = true

                swal({
                    title: '必填欄位沒填寫',
                    type: 'warning'
                })
            } else {
                $(this).next().hide()
            }
        })


        if (!stop) {
            $('.identity').children('label').each(function () {     //取身分資料
                var $checkbox = $(this).children('[type=checkbox]')
                if ($checkbox.prop('checked')) {
                    identityData.push($checkbox.val())
                }
            })

            me.name = $myName.val()  //姓名
            me.identity = identityData   //身分補充
            me.gender = $gender.val()    //性別
            me.birth = {                //出生年月      
                year: $yearList.val(),
                month: $monthList.val()
            }
            me.site = {
                city: $city.val(),  //城市
                district: $district.val()    //區域
            }
            me.phone = $phone.val()     //手機號碼
            me.tel = $tel.val()  //連絡是話
            me.mail = $mail.val()     //電子信箱

            console.log(me)

            /*=====填到預覽履歷=====*/
            $tdName = $tdName.text(me.name)     //姓名
            for (var i = 0; i < me.identity.length; i++) {
                $tdName.html($tdName.html() + "&nbsp;&nbsp;(" + me.identity[i] + ")")
            }

            $('[name=tdGender]').text(me.gender)  //性別

            var birthday = new Date(me.birth)
            $('[name=year]').text(birthday.getFullYear() + '年')
            $('[name=month]').text((birthday.getMonth() + 1) + '月')
            $('[name=myage]').text(me.age + '歲')
            $('[name=mycity]').text(me.site.city)
            $('[name=mydistrict]').text(me.site.district)
            $('[name=tdPhone]').text(me.phone)
            $('[name=tdTel]').text(me.tel)
            $('[name=tdMail]').text(me.mail)


            $should.each(function () {    //隱藏警示語
                $(this).next().hide()
            })

            backProfile()

            if (doing) {
                showModal()
            }

        }

    }

    //儲存學經歷
    function storeStudy() {
        var html = ""
        var $should = $('.expWrap').find('.should')
        var stop = false
        var expData = []  //經驗資料

        $should.each(function () {
            if ($(this).children('span').text() == '請選擇') {
                $(this).next().show()
                stop = true

                swal({
                    title: '必填欄位沒填寫',
                    type: 'warning'
                })
            } else {
                $(this).next().hide()
            }
        })


        if (!stop) {
            diploma.studyHeight = $diploma.text() != '請選擇' ? $diploma.text() : ""  //最高學歷
            diploma.schoolName = $schoolName.val()      //校名
            diploma.studyKind = $studyKind.text() != '請選擇' ? $studyKind.text() : ""  //科系類別
            diploma.department = $('[name=department]').val()   //科系
            diploma.exp = $exp.text() != '請選擇' ? $exp.text() : ""  //工作經驗
            diploma.position = $position.text() != '請選擇' ? $position.text() : ""  //希望職務
            diploma.jobType = $jobType.text() != '請選擇' ? $jobType.text() : ""  //職務性質

            $('.workExp').each(function () {    //工作經驗
                var expObj = {}
                expObj = {
                    incName: $(this).find('[name=incName]').val(),    //公司名稱
                    hide: $(this).find('[type=checkbox]').prop('checked'),   //是否要隱藏公司名稱
                    jobKind: $(this).find('[name=jobKind]').text() != '請選擇' ? $(this).find('[name=jobKind]').text() : "",   //職務類型
                    isStay: $(this).find('.stay_work').prop('checked'),  //是否在職
                    startTime: $(this).find('[name=startTime]').val(),      //任職期間開始
                    endTime: $(this).find('[name=endTime]').val(),       //結束時間
                    jobContent: $(this).find('[name=jobContent]').val()     //工作內容
                }

                expData.push(expObj)
            })

            diploma.workExp = expData
            console.log(diploma)

            /*=====填到預覽履歷=====*/
            $('[name=tdDiploma]').text(diploma.studyHeight + " " + diploma.schoolName + " " + diploma.studyKind + " " + diploma.department)
            $('[name=tdExp]').text(diploma.exp)
            $('[name=tdPosition]').text(diploma.position)
            $('[name=tdJobType]').text(diploma.jobType)

            for (var e in diploma.workExp) {
                var begin = new Date(diploma.workExp[e].startTime).getFullYear() + "/" + (new Date(diploma.workExp[e].startTime).getMonth() + 1)    //到職時間
                var finish = new Date(diploma.workExp[e].endTime).getFullYear() + "/" + (new Date(diploma.workExp[e].endTime).getMonth() + 1)   //離職時間

                if (!diploma.workExp[e].hide) {     //判斷是否顯示公司名稱
                    html += "<tr>"
                    html += "<td>公司名稱</td>"
                    html += "<td>" + diploma.workExp[e].incName + "</td>"
                    html += "</tr>"
                }
                html += "<tr>"
                html += "<td>職務類型</td>"
                html += "<td>" + diploma.workExp[e].jobKind + "</td>"
                html += "</tr>"
                html += "<tr>"
                html += "<td>任職時間</td>"
                html += "<td>" + (begin + " - " + finish) + "</td>"
                html += "</tr>"
                html += "<tr>"
                html += "<td>工作內容</td>"
                html += "<td>" + diploma.workExp[e].jobContent + "</td>"
                html += "</tr>"

            }

            $('[name=expTable]').html(html)

            backProfile()

            if (doing) {
                showModal()
            }

        }

    }

    //儲存條件
    function storeStandard() {
        var $should = $('.criteria').find('.should')
        var stop = false
        var rule

        $should.each(function () {
            if ($(this).children('span').text() == '請選擇') {
                $(this).next().show()
                stop = true

                swal({
                    title: '必填欄位沒填寫',
                    type: 'warning'
                })
            } else {
                $(this).next().hide()
            }
        })


        if (!stop) {
            standard.region = $region.text()      //希望地區
            standard.period = $period.text() != '請選擇' ? $period.text() : ""   //上班時段


            $('.expect').children('label').each(function () {   //期望待遇
                var $radio = $(this).children('[type=radio]')
                if ($radio.prop('checked')) {
                    rule = $radio.val()
                    return false
                }
            })

            standard.hope = {
                rule: rule,
                bottomMoney: $('[name=bottomMoney]').val(),
                topMoney: $('[name=topMoney]').val()
            }

            console.log(standard)

            /*=====填到預覽履歷=====*/
            $('[name=tdRegion]').text(standard.region)
            $('[name=tdPeriod]').text(standard.period)
            $('[name=tdHope]').text(standard.hope.rule + " (" + standard.hope.money + ")")

            backProfile()

            if (doing) {
                showModal()
            }

        }
    }

    //儲存技能專長
    function storeSkill() {
        var html = ""
        var $should = $('.skillBox').find('.should')
        var stop = false
        var langData = []

        $should.each(function () {
            if ($(this).children('span').text() == '請選擇') {
                $(this).next().show()
                stop = true

                swal({
                    title: '必填欄位沒填寫',
                    type: 'warning'
                })
            } else {
                $(this).next().hide()
            }
        })


        if (!stop) {
            $myLang.children('.lang').each(function () {      //語言能力
                var langObj = {}

                langObj = {
                    word: $(this).find('[name=word]').text() != '請選擇' ? $(this).find('[name=word]').text() : "",    //語言
                    listen: $(this).find('[name=listen]').text() != '請選擇' ? $(this).find('[name=listen]').text() : "",   //聽
                    speak: $(this).find('[name=speak]').text() != '請選擇' ? $(this).find('[name=speak]').text() : "",   //說
                    read: $(this).find('[name=read]').text() != '請選擇' ? $(this).find('[name=read]').text() : "",   //讀
                    write: $(this).find('[name=write]').text() != '請選擇' ? $(this).find('[name=write]').text() : "",   //寫
                }
                langData.push(langObj)
            })


            skill.drive = $drive.text()    //駕照
            skill.tool = $tool.text()      //擅長工具
            skill.license = $license.val()    //證照
            skill.technic = $technic.val()    //工作技能
            skill.language = langData   //語言

            console.log(skill)

            /*=====填到預覽履歷=====*/
            $('[name=tdDrive]').text(skill.drive)
            $('[name=tdTool]').text(skill.tool)
            $('[name=tdLicense]').text(skill.license)
            $('[name=tdTechnic]').text(skill.technic)


            for (var f in skill.language) {
                var listen = "聽(" + skill.language[f].listen + ")"
                var speak = "說(" + skill.language[f].speak + ")"
                var read = "讀(" + skill.language[f].read + ")"
                var write = "寫(" + skill.language[f].write + ")"

                html += "<div>"
                html += "<p>" + skill.language[f].word + "</p>"
                html += "<p>" + (listen + speak + read + write) + "</p>"
                html += "</div>"
            }

            $('[name=tdLang]').html(html)

            backProfile()

            if (doing) {
                showModal()
            }

        }

    }

    //儲存自傳
    function storeAbout() {
        article = $about.val()
        $('.desBox').text(article)

        backProfile()

        if (doing) {
            showModal()
        }
    }

    //modal出現
    function showModal() {
        $('#saveModal').modal('show')
    }

    //隱藏modal
    function hideModal() {
        $('#saveModal').modal('hide')
    }

    //顯示履歷範例
    function showDemo() {
        var html = ""
        var number
        var targetData = demoData[$(this).data('demo')]


        switch ($(this).data('demo')) {
            case "one":
                number = "範例一"
                break
            case "two":
                number = "範例二"
                break
            case "three":
                number = "範例三"
                break
        }

        $('.demoTitle').text(number)

        for (var a of targetData) {
            if (a.title) {
                html += "<div class=\"title\">" + a.title + "</div>"
            }
            html += "<div class=\"content\">" + a.content + "</div>"
        }


        $('.demoContent').html(html)
        $('#demoModal').modal('show')

    }


    init()

})